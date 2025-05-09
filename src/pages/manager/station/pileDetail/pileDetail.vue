<template>
  <view class="container">
    <view class="title">{{ pileInfo?.name }}详情</view>
    <view class="pile-info">
      <view v-if="pileInfo?.desc" class="info-item">
        <view class="item-label">充电桩备注：</view>
        <view class="item-value">{{ pileInfo?.desc }}</view>
      </view>
      <view class="info-item">
        <view class="item-label">使用状态：</view>
        <view class="item-value">{{ pileStatusFormatter(pileInfo!) }}</view>
      </view>
      <view v-if="pileInfo?.scooterCode" class="info-item">
        <view class="item-label">电动车编号：</view>
        <view class="item-value">{{ pileInfo?.scooterCode }}</view>
      </view>
      <view v-if="pileInfo?.begin" class="info-item">
        <view class="item-label">开始使用时间：</view>
        <view class="item-value">{{ dateTimeFormatter(pileInfo?.begin) }}</view>
      </view>
      <view v-if="pileInfo?.end" class="info-item">
        <view class="item-label">{{ pileInfo.status === Status.Using ? '预计结束' : '结束' }}使用时间：</view>
        <view class="item-value">{{ dateTimeFormatter(pileInfo?.end) }}</view>
      </view>
      <view v-if="pileInfo?.endDesc" class="info-item">
        <view class="item-label">结束描述：</view>
        <view class="item-value">{{ pileInfo?.endDesc }}</view>
      </view>
    </view>
    <button
      v-if="pileInfo?.status === Status.Using"
      type="warn"
      style="align-self: stretch; margin-top: 16px"
      @click="forceFinish"
    >
      强制结束{{ pileInfo?.scooterCode }}使用
    </button>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import api from '@/api';
import { ref } from 'vue';
import { PileDetailVO, Status } from '@/api/station';
import { dateTimeFormatter } from '@/utils/timeformatter';
import scooter from '@/api/scooter';

const pileId = ref<number>();
const stationId = ref<number>();
const pileInfo = ref<PileDetailVO>();

const pileStatusFormatter = (pile: PileDetailVO) => {
  if (pile.isSoonFree) {
    return '即将充满';
  }
  switch (pile.status) {
    case Status.Repairing:
      return '正在维修';
    case Status.Using:
      return '正在使用';
    case Status.Free:
      return '空闲';
    case Status.Ended:
      return '空闲';
    default:
      break;
  }
};

function forceFinish() {
  uni.showModal({
    title: '强制结束',
    content: `确定要强制结束${pileInfo.value?.scooterCode}充电吗`,
    success: function (res) {
      if (res.confirm) {
        if (!pileInfo.value?.scooterId) {
          return;
        }
        api.endChargeScooter({ scooterId: pileInfo.value?.scooterId }).then((res) => {
          uni.showToast({
            title: '强制结束成功',
            icon: 'success',
            duration: 2000,
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 2000);
        });
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
}
onLoad((options) => {
  pileId.value = options?.pileId;
  stationId.value = uni.getStorageSync('stationId');
  if (!stationId.value || !pileId.value) {
    return;
  }
  api.getPileInfo({ stationId: stationId.value, pileId: pileId.value }).then((res) => {
    pileInfo.value = {
      ...res.data,
      begin: res.data.begin ? new Date(res.data.begin) : undefined,
      end: res.data.end ? new Date(res.data.end) : undefined,
    };
  });
});
</script>
<style scoped>
.container {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  font-size: 40rpx;
  font-weight: bold;
  margin: 16px;
}
.pile-info {
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, 0.1);
  padding: 16px;
  align-self: stretch;
}
.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.item-label {
  font-size: 28rpx;
  color: #999;
  margin-right: 10rpx;
  width: 200rpx;
  text-align: right;
}
.item-value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}
</style>
