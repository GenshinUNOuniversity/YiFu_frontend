<template>
  <div v-if="!isLogin">
    <div class="header-unlogin">
      <image :src="userInfo?.info.avatarUrl || '../../static/logo-main.png'"
      style="height: 20vmin; width: 20vmin;"
      @click="login" />
    </div>
    <div class="body-unlogin">
      <p class="bigtext">hi，小马</p>
      <div>
        <p class="smalltext">点击头像注册/登录\n</p>
        <p class="smalltext">即可使用充电服务</p>
      </div>
    </div>
  </div>
  <div v-else>
    <image src="../../static/message.png" style="height: 30px; width: 30px; position: absolute;" />
    <div class="header-login">
      <span>{{ userInfo?.info.nickname || '昵称' }}</span>
      <image :src="userInfo?.info.avatarUrl || '../../static/avatar.png'"
      style="height: 20vmin; width: 20vmin;" />
      <div>
        <span>ID：{{ userInfo?.info.studentId || '未知' }}</span>
        <span>信用分：{{ userInfo?.info.Honesty || '未知' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import api from '@/api';
import { Role, UserProfileVO } from '@/api/user';
import { ScooterVO } from '@/api/scooter';
import { useTrack } from '@/business/track/useTrack';

const trackService = useTrack();
const status = ref<Role>(uni.getStorageSync('status') || 'None');
const userInfo = ref<UserProfileVO>();
const normalScooters = ref<ScooterVO[]>([]);
const auditingScooters = ref<ScooterVO[]>([]);
const rejectedScooters = ref<ScooterVO[]>([]);

const isLogin = ref(!(uni.getStorageSync('auth') === ''));

const login = async () => {
  try {
    await api.login();
    isLogin.value = true;
    onShowFun();
  } catch (error) {
    uni.showToast({
      title: '登录失败',
      icon: 'error',
    });
  }
};

const onShowFun = async () => {
  await api.getUserInfo().then((res) => {
    userInfo.value = res.data;
    status.value = userInfo.value.role;
    if (res.data.extend.manager?.stationId) {
      uni.setStorage({
        key: 'stationId',
        data: res.data.extend.manager.stationId,
      });
    }
  });

  api.getUserScooterList({
    pageNum: 1,
    pageSize: 100,
  }).then((res) => {
    normalScooters.value = res.data.data.filter((scooter) => {
      return scooter.status === 'Normal';
    });
    auditingScooters.value = res.data.data.filter((scooter) => {
      return scooter.status === 'Auditing';
    });
    rejectedScooters.value = res.data.data.filter((scooter) => {
      return scooter.status === 'Rejected';
    });
  });
  
  trackService.doTrack({
    pgid: trackService.PageId.My,
    eid: '',
    eventId: trackService.EventId.IMPL,
  });
};

onShow(() => {
  onShowFun();
});

const editScooter = () => {
  if (normalScooters.value.length > 0) {
    uni.navigateTo({
      url: `/pages/my/edit/edit?haveScooter=true&scooterId=${normalScooters.value[0].scooterId}&code=${normalScooters.value[0].code}&checked=true`,
    });
  } else if (auditingScooters.value.length > 0) {
    uni.navigateTo({
      url: `/pages/my/edit/edit?haveScooter=true&scooterId=${auditingScooters.value[0].scooterId}&code=${auditingScooters.value[0].code}`,
    });
  } else if (rejectedScooters.value.length > 0) {
    uni.navigateTo({
      url: `/pages/my/edit/edit?haveScooter=true&scooterId=${rejectedScooters.value[0].scooterId}&code=${rejectedScooters.value[0].code}&reject=true`,
    });
  } else {
    uni.navigateTo({
      url: `/pages/my/edit/edit?haveScooter=false`,
    });
  }
};

const logout = () => {
  uni.showActionSheet({
    itemList: ['清空缓存'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.clearStorageSync();
        uni.reLaunch({
          url: '/pages/charging/index',
        });
      }
    },
  });
};
</script>

<style scoped lang="less">
.header-unlogin {
  height: 60vh;
  width: 100vw;
  background-color: green;
  display: flex;
  justify-content: center;
  align-items: center;
}

.body-unlogin {
  height: calc(40vh - 50px);
  width: 100vw;
  // border: 2px solid blueviolet;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6vh;
}

.header-login {
  height: 40vh;
  width: 100vw;
  background-color: green;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bigtext {
  color: gray;
  font-size: 2rem;
}

.smalltext {
  color: gray;
}
</style>