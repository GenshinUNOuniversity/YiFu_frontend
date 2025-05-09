<template>
  <!-- <div style="height: var(--status-bar-height); width: 100vw;" /> -->
  <div v-if="!isLogin">
    <div class="header-unlogin">
      <image src="../../static/logo_main.png" style="height: 20vmin; width: 20vmin;" @click="login" />
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
        <span style="color: white;">ID：{{ userInfo?.userId || '未知' }}</span>
        <div style="display: flex; align-items: center; gap: 2px">
          <span style="color: white;">信用分：{{ userInfo?.honest || '未知' }}</span>
          <image src="../../static/learn_more.svg" style="height: 15px; width: 15px;" @click="honestyInfo" />
        </div>
      </div>
    </div>
    <!-- <div style="height: 30px; width: 100vw;"></div> -->
    <div class="body-login">
      <div class="link" @click="gotoMessage">
        <!-- <image src="../../static/message.png" style="height: 30px; width: 30px; position: absolute;" /> -->
        <span style="color: green;">我的消息</span>
      </div>
      <div class="link" @click="editScooter">
        <span style="color: green;">我的小马</span>
      </div>
      <div class="link" @click="gotoHistory">
        <span style="color: green;">充电记录</span>
      </div>
      <div class="link" @click="gotoReport">
        <span style="color: green;">我要反馈</span>
      </div>
      <div class="link" @click="editUserProfile">
        <span style="color: purple;">修改个人信息</span>
      </div>
      <div class="logout-button" @click="logout">
        <span style="color: red;">退出登录</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import api from '@/api';
import { UserProfileVO } from '@/api/user';
import { ScooterProfileVO } from '@/api/scooter';
// import { useTrack } from '@/business/track/useTrack';

// const trackService = useTrack();
// const status = ref<Role>(uni.getStorageSync('user-profile').role || 'None');
const userInfo = ref<UserProfileVO>();
const Scooters = ref<ScooterProfileVO>();

// const isLogin = ref(!(uni.getStorageSync('auth') === ''));
const isLogin = ref(true);

const login = async () => {
  try {
    await api.login();
    isLogin.value = true;
    onShowFun();
  } catch (error) {
    // uni.showToast({
    //   title: '登录失败',
    //   icon: 'error',
    //   duration: 500
    // });
  }
};

const onShowFun = async () => {
  await api.getUserInfo(uni.getStorageSync('userId')).then((res) => {
    userInfo.value = res.data;
    // status.value = userInfo.value.role;
    // if (userInfo.value.stationId) {
    //   uni.setStorage({
    //     key: 'stationId',
    //     data: res.data.stationId,
    //   });
    // }
  });

  api.getUserScooter().then((res) => {
    Scooters.value = res.data;
  });
  
  // 是否可以去掉这个函数？
  // trackService.doTrack({
  //   pgid: trackService.PageId.My,
  //   eid: '',
  //   eventId: trackService.EventId.IMPL,
  // });
};

onShow(() => {
  // 检查数据是否损坏
  console.log("my:onshow");
  uni.setStorageSync('scooterinfo', {
    name: '小电驴',
    avatarUrl: '',
    code: 'X0001',
    expectHour: 4,
    moveNotes: '随便挪'
  })
  // if (isLogin.value === false) {
  //   return;
  // }
  // const id = uni.getStorageSync('userId');
  // if (id === '') {
  //   uni.showToast({
  //     title: '本地数据受损，请重新登录',
  //     icon: 'none',
  //     mask: true,
  //     duration: 1000
  //   });
  //   return;
  // }
  // onShowFun();
});

const editScooter = () => {
    uni.navigateTo({
      url: `./editScooterProfile/editScooterProfile`,
    });
  // }
};

const honestyInfo = () => {
  uni.navigateTo({
    url: `./honestyInfo/honestyInfo`
  });
};

const editUserProfile = () => {
  uni.navigateTo({
    url: `./editUserProfile/editUserProfile`
  });
};

const gotoMessage = () => {
  uni.navigateTo({
    url: './message/message'
  });
};

const gotoReport = () => {
  uni.navigateTo({
    url: './report/report'
  });
};

const gotoHistory = () => {
  uni.navigateTo({
    url: './chargeHistory/chargeHistory'
  });
};

const logout = () => {
  uni.showActionSheet({
    itemList: ['确认退出登录'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // uni.clearStorageSync();
        // uni.reLaunch({
        //   url: '../charging/index',
        // });
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

.body-login {
  height: calc(40vh - 50px);
  width: 100vw;
  // border: 2px solid blueviolet;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}

.link {
  height: 40px;
  width: 86vw;
  border-bottom: gray solid 2px;
  padding-bottom: 5px;
  margin-left: 7vw;
  margin-right: 7vw;
  margin-top: 30px;
}

.logout-button {
  // border: red solid 1px;
  height: 30px;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 30px;
  background-color: rgb(241, 241, 241);
}
</style>