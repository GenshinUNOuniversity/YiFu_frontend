<template>
  <view class="title">驳回原因</view>
  <view class="input-box">
    <textarea v-model="message" class="input-area" placeholder="请输入原因" maxlength="500" />
  </view>

  <view class="pass" @click="handleClick">驳回</view>
</template>

<script setup lang="ts">
import api from '@/api';
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

const message = ref('');
const reportId = ref<number>();
onLoad((options) => {
  reportId.value = options.reportId;
});

const handleClick = () => {
  if (!reportId.value) {
    uni.showToast({ icon: 'error', title: '参数错误' });
    uni.navigateBack();
  }
  if (!message.value) {
    uni.showToast({ icon: 'error', title: '请填写原因' });
  }
  api.changeReportStatus(reportId.value!, 2, message.value).catch((err) => {
    uni.showToast({
      title: err.message,
      icon: 'none',
    });
  });
};
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 50rpx;
  margin-top: 130rpx;
  margin-bottom: 50rpx;
}

.input-box {
  width: 60%;
  height: 750rpx;
  background-color: white;
  padding: 50rpx;
  border-radius: 60rpx;
  margin: auto;
  box-shadow: 0px 0px 10px grey inset;
  margin-bottom: 70rpx;
}

.input-area {
  width: 100%;
  height: 100%;
}

.pass {
  width: 70%;
  height: 95rpx;
  background-color: #dadada;
  margin: 0 auto;
  text-align: center;
  line-height: 95rpx;
  font-size: 40rpx;
  border-radius: 30rpx;
  color: #aa0000;
  box-shadow: 0px 4px 4px 1px #d4d4d4;
}
</style>
