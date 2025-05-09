<template>
  <div
    :style="{ background: '#f8f8f8', height: safeAreaTop + 'px', width: '100vw', position: 'sticky', top: '0px' }"
  ></div>
  <div class="index">
    <div class="title">管理端</div>
    <image class="profile-pic" :src="userInfo?.info.avatarUrl" />
    <p class="name">{{ userInfo?.info.nickname ? userInfo?.info.nickname : '你怎么还没有名字' }}</p>
    <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 8px">
      <div class="bind-station">{{ stationName ? stationName : '充电站怎么还没有名字' }}</div>
      <button plain="true" size="mini" @click="showSubscribePic">订阅消息</button>
    </div>
    <div>
      <div class="big-button" @click="jumpTo('newsManage')">
        <p style="width: 180px; text-align: center">公告设置</p>
        <image style="height: 64px; width: 64px" src="/static/gonggao.svg" />
      </div>
      <div class="big-button" @click="jumpTo('handleReport')">
        <p style="width: 180px; text-align: center">举报处理</p>
        <image style="height: 64px; width: 64px" src="/static/jubao.svg" />
      </div>
      <div class="big-button" @click="jumpTo('auditScooter')">
        <p style="width: 180px; text-align: center">用户审核</p>
        <image style="height: 64px; width: 64px" src="/static/shenhe.svg" />
      </div>
      <div class="big-button" @click="jumpTo('blacklist')">
        <p style="width: 180px; text-align: center">黑名单管理</p>
        <image style="height: 64px; width: 64px" src="/static/heimingdan.svg" />
      </div>
      <div class="big-button" @click="jumpTo('station')">
        <p style="width: 180px; text-align: center">充电桩管理</p>
        <image style="height: 64px; width: 64px" src="/static/chongdianzhuang.svg" />
      </div>
      <div class="big-button" @click="backHome">
        <p style="width: 180px; text-align: center">退出管理端</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onShow, onLoad } from '@dcloudio/uni-app';
import api from '@/api';
import { UserProfileVO } from '@/api/user';

const safeAreaTop = ref(44);
const userInfo = ref<UserProfileVO>();
const stationName = ref('');

const showSubscribePic = () => {
  api.getWXPusherQrCode().then((res) => {
    uni.showToast;
    uni.previewImage({
      urls: [res.data],
    });
  });
};

onShow(() => {
  uni.getSystemInfo({
    success: (rusult) => {
      safeAreaTop.value = rusult.safeArea!.top;
      console.log(safeAreaTop.value);
    },
  });
});

onLoad(() => {
  api
    .getUserInfo()
    .then((res) => {
      userInfo.value = res.data;
      if (res.data.extend.manager?.stationId) {
        uni.setStorage({
          key: 'stationId',
          data: res.data.extend.manager.stationId,
        });
        api.getStationInfo({ stationId: res.data.extend.manager?.stationId }).then((res) => {
          stationName.value = res.data.name;
        });
      }
      if (userInfo.value.role === 'None' || userInfo.value.role === 'User') {
        uni.showModal({
          title: '警告',
          content: '不要乱搞，你没有权限看这个，快走快走',
          confirmText: '我马上走',
          showCancel: false,
          success: () => {
            uni.switchTab({ url: '/pages/charging/index' });
          },
        });
      }
    })
    .catch(() => {
      uni.showModal({
        title: '警告',
        content: '不要乱搞，你没有权限看这个，快走快走',
        confirmText: '我马上走',
        showCancel: false,
        success: () => {
          uni.switchTab({ url: '/pages/charging/index' });
        },
      });
    });
});
const jumpTo = (url: string) => {
  uni.navigateTo({ url: `./${url}/${url}` });
};

const backHome = () => {
  uni.switchTab({ url: '/pages/charging/index' });
};
</script>

<style scoped>
.title {
  text-align: center;
  padding-top: 8px;
  width: 100vw;
  font-size: 24px;
  font-weight: 400;
  height: 44px;
  background-color: #f8f8f8;
  position: fixed;
}
.index {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-pic {
  margin-top: 66px;
  height: 140px;
  width: 140px;
  border-radius: 100%;
  float: left;
  border: 1px solid #707070;
}
.name {
  margin-top: 12px;
  font-size: 20px;
}
.bind-station {
  margin-top: 9px;
  font-size: 20px;
  font-weight: 400;
  color: #81b338;
}
.big-button {
  height: 80px;
  width: 604rpx;
  margin-top: 18px;
  margin-left: 80rpx;
  margin-right: 80rpx;
  background: #ffffff;
  border-radius: 12px 12px 12px 12px;
  opacity: 1;
  border: 1px solid #707070;
  align-self: stretch;
  font-size: 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 15px;
}
</style>
