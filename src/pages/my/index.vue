<template>
  <!-- <div style="height: var(--status-bar-height); width: 100vw;" /> -->
  <div v-if="isLogin">
    <div class="header-unlogin">
      <image :src="'../../static/logo-main.png'"
      style="height: 20vmin; width: 20vmin;"
      @click="login" />
    </div>
    <div class="body-unlogin">
      <p style="font-size: 2rem; color: gray;">hi，小马</p>
      <div>
        <p style="color: gray;">点击头像注册/登录\n</p>
        <p style="color: gray;">即可使用充电服务</p>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="header-login">
      <span style="font-size: 2rem; color: white;">{{ userInfo?.nickname || '昵称' }}</span>
      <image :src="userInfo?.avatarUrl || '../../static/avatar.png'"
      style="height: 20vmin; width: 20vmin;" />
      <div style="display: flex; gap: 20px">
        <span style="color: white;">ID：{{ userInfo?.Id || '未知' }}</span>
        <div style="display: flex; align-items: center; gap: 2px">
          <span style="color: white;">信用分：{{ userInfo?.honest || '未知' }}</span>
          <image src="../../static/learn_more.svg" style="height: 15px; width: 15px;" @click="honestyInfo" />
        </div>
      </div>
    </div>
    <div style="height: 30px; width: 100vw;"></div>
    <div class="body-login">
      <div style="height: 40px; width: 100vw;">
        <image src="../../static/message.png" style="height: 30px; width: 30px; position: absolute;" />
      </div>
      <div style="height: 40px; width: 100vw;">
        <span style="color: green;">我的小马</span>
      </div>
      <div style="height: 40px; width: 100vw;">
        <span style="color: green;">充电记录</span>
      </div>
      <div style="height: 40px; width: 100vw;">
        <span style="color: green;">我要反馈</span>
      </div>
      <div class="logout-button" @click="logout">
        <span style="color: red">退出登录</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import api from '@/api';
import { Role, UserProfileVO, UserType } from '@/api/user';
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
    if (res.data.userType === UserType.Staff && res.data.role === Role.Manager) {// res.data.stationId
      uni.setStorage({
        key: 'stationId',
        data: res.data.stationId,
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

const honestyInfo = () => {
  uni.navigateTo({
    url: `./honestyInfo/honestyInfo`,
  });
}

const logout = () => {
  uni.showActionSheet({
    itemList: ['确认退出登录'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.clearStorageSync();
        uni.reLaunch({
          url: '../charging/index',
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.logout-button {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>