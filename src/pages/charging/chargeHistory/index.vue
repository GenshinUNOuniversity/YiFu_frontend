<template>
  <view v-for="charge in chargeList" :key="charge.chargeHistoryId" class="content">
    <view class="header">
      <view>
        <view class="title">{{ charge.stationName }} {{ charge.pileName }}</view>
        <view class="create-time">{{ dateTimeFormatter(charge.begin) }}</view>
      </view>
      <view>
        <view class="status" :style="{ color: charge.status === Status.Using ? '#056334' : 'rgba(0, 0, 0, 0.4)' }">
          {{ statusFormatter(charge.status) }}
        </view>
      </view>
    </view>
    <view class="detail">
      <view class="left">
        <template v-if="charge.status !== Status.Using">
          <view>
            <image :src="charge.endPhotoUrl" @click="previewPhoto(charge.endPhotoUrl!)"></image>
            <image :src="charge.movePhotoUrl" @click="previewPhoto(charge.movePhotoUrl!)"></image>
          </view>
          <text class="note-title">移车备注</text>
          <text class="note">{{ charge.moveDesc ? charge.moveDesc : '无移车备注' }}</text>
        </template>
        <view v-else class="using">
          <text class="note">暂无详细信息</text>
          <!-- <button @click="finishCharging(charge.scooterCode)">提前结束</button> -->
        </view>
      </view>
      <view class="right">
        <view>
          <text class="name">{{ charge.scooterCode }}</text>
          <text v-if="charge.end" class="charge-status">结束时间：{{ dateTimeFormatter(charge.end) }}</text>
          <text v-else class="charge-status">本次充满需要{{ charge.expectHour }}小时</text>
        </view>
        <view class="problem" @click="startReport(charge.chargeHistoryId)">
          <text>有疑问</text>
          <image src="../../../static/chevron-right.svg" />
        </view>
      </view>
    </view>
  </view>
  <bottom-loading-prompt :has-more="hasMoreHistory" :is-loading="isLoadingHistory" />
</template>

<script lang="ts" setup>
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import api from '@/api';
import { ChargeHistoryItemVO, Status } from '@/api/chargehistory';
import { ref } from 'vue';
import BottomLoadingPrompt from '@/pages/components/bottomLoadingPrompt/bottomLoadingPrompt.vue';
import { dateTimeFormatter } from '@/utils/timeformatter';
import { compareAsc } from 'date-fns';

const previewPhoto = (url: string) => {
  if (url === '' || url === null) {
    return;
  }
  uni.previewImage({
    urls: [url],
  });
};

const statusFormatter = (status: Status) => {
  switch (status) {
    case Status.EndedByOther:
      return '被确认充满';
    case Status.EndedBySelf:
      return '已充满';
    case Status.Using:
      return '正在充电';
    case Status.ForcedEnd:
      return '自己结束';
    case Status.Using:
      return '正在使用';
    case Status.EndedPeacefully:
      return '正常到时间结束';
    default:
      return '未知情况';
  }
};

const chargeList = ref<ChargeHistoryItemVO[]>([]);
const startReport = (chargeHistoryId: number) => {
  uni.navigateTo({
    url: `/pages/report/report?whichKind=chargeHistory&chargeHistory=${JSON.stringify(
      chargeList.value.filter((item) => item.chargeHistoryId === chargeHistoryId)[0],
    )}`,
  });
};

const isLoadingHistory = ref(false);
const hasMoreHistory = ref(true);
const historyPageNum = ref(1);
const getHistory = async () => {
  api
    .getChargeHistory({
      pageNum: historyPageNum.value,
      pageSize: 5,
    })
    .then((res) => {
      chargeList.value = chargeList.value
        .concat(
          res.data.data.map((item) => {
            item.begin = new Date(item.begin);
            item.end = item.end ? new Date(item.end) : undefined;
            return item;
          }),
        )
        .sort((b, a) => compareAsc(a.begin, b.begin));
      if (historyPageNum.value * 5 >= res.data.total) {
        hasMoreHistory.value = false;
      } else {
        historyPageNum.value += 1;
      }
      uni.hideLoading();
    })
    .catch(() => {
      uni.hideLoading();
      uni.showToast({
        title: '获取充电历史失败',
        icon: 'none',
      });
    });
};

onReachBottom(async () => {
  if (hasMoreHistory.value && !isLoadingHistory.value) {
    isLoadingHistory.value = true;
    await getHistory();
    isLoadingHistory.value = false;
  }
});

// TODO: 叫后台历史记录+scooterID
// const finishCharging = () => {
//   uni.showModal({
//     title: '结束充电',
//     content: '请问要提前结束充电吗',
//     success: function (res) {
//       if (res.confirm) {
//         console.log('用户点击确定');
//         api
//           .endChargeScooter({
//             scooterId: scootersDetail.value[0].scooterId!,
//           })
//           .then(() => {
//             getHistory();
//           });
//       } else if (res.cancel) {
//         console.log('用户点击取消');
//       }
//     },
//   });
// };

onLoad(() => {
  uni.showLoading({ title: '加载中' });
  getHistory();
});
</script>

<style scoped lang="less">
.content {
  width: auto;
  background-color: white;
  margin-top: 12px;
}

.header {
  padding: 10px 14px;
  border-bottom: 1px solid #d8d8d8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  display: block;
  color: rgba(0, 0, 0, 0.9);
}

.create-time {
  display: block;
  font-size: 12px;
  color: #9e9e9e;
}

.status {
  display: block;
  font-size: 12px;
}

.detail {
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
}

.left {
  image {
    margin-right: 6px;
    width: 50px;
    height: 50px;
  }

  .note-title {
    margin-top: 35rpx;
    color: #1a1a1a;
    font-size: 12px;
    display: block;
  }

  .note {
    font-size: 12px;
    color: #9e9e9e;
  }

  .using {
    display: flex;
    flex-direction: column;
    height: 100%;

    button {
      color: #b11f26;
      font-size: 12px;
      padding: 4px 6px;
      border: 1px solid #b11f26;
      line-height: 12px;
      margin: 0;
      border-radius: 2px;
    }

    .note {
      display: block;
      flex: 1;
    }
  }
}

.right {
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .name {
    display: block;
    font-size: 24px;
    color: #1a1a1a;
    font-weight: bold;
  }

  .charge-status {
    font-family: SourceHanSansCN-Regular;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }
}

.problem {
  margin-top: 30rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  text {
    font-family: SourceHanSansCN-Regular;
    font-size: 13px;
    color: #3d3d3d;
  }

  image {
    width: 16px;
    height: 16px;
  }
}
</style>
