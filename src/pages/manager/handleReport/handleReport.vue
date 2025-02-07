<template>
  <button v-if="!isSubscribed" class="submit" @click="subscribeMessage">订阅举报提醒</button>
  <view class="container">
    <checkbox-group
      class="contain-box"
      style="
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: sticky;
        top: 16px;
        margin: 16px;
        padding: 8px 0 8px 0;
        gap: 8px;
      "
      @change="handleSelectChange"
    >
      <label> <checkbox value="Committed" :checked="true" />待处理 </label>
      <label> <checkbox value="Solved" />已通过 </label>
      <label> <checkbox value="Rejected" />已驳回 </label>
    </checkbox-group>
    <template v-for="(report, i) in showReportList" :key="i">
      <view class="contain-box" @click="handleClick(i)">
        <view style="display: flex">
          <image :src="report.photoUrlList[0]" class="picture" mode="aspectFill" />
          <view style="display: block">
            <template>
              <view class="reason-shorten" style="font-weight: 500; font-size: 16px">{{ report.title }}</view>
              <view class="reason-shorten">{{ report.content }}</view>
              <template v-if="report.solvedTime && report.status === 'Solved'">
                <view class="result-pass">已通过</view>
                <view class="handleTime-pass"> 处理时间：{{ dateTimeFormatter(report.solvedTime) }} </view>
              </template>
              <template v-if="report.solvedTime && report.status === 'Rejected'">
                <view class="result-reject">已驳回</view>
                <view class="handleTime-reject"> 处理时间：{{ dateTimeFormatter(report.solvedTime) }} </view>
              </template>
            </template>
          </view>

          <image src="../../../static/arrow-right2.svg" class="arrow-right"></image>
        </view>
        <view class="reportMessage">
          <view style="width: 55rpx"></view>
          <span style="font-size: 18rpx">{{ dateTimeFormatter(report.createTime) }}</span>
          <view v-if="report.relatedPile" style="width: 15rpx"></view>
          <span style="font-size: 18rpx">{{ report.relatedPile?.stationName }}</span>
          <view style="width: 15rpx"></view>
          <span v-if="report.relatedPile" style="font-size: 18rpx">{{ report.relatedPile?.pileName }}号</span>
        </view>
      </view>
    </template>
  </view>
  <bottom-loading-prompt :is-loading="isReportListLoading" :has-more="hasMoreReportList && showReportList.length > 5" />
</template>

<script lang="ts" setup>
import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app';
import api from '@/api';
import { ref, watch } from 'vue';
import { ReportItemVO } from '@/api/report';
import BottomLoadingPrompt from '@/pages/components/bottomLoadingPrompt/bottomLoadingPrompt.vue';
import { dateTimeFormatter } from '@/utils/timeformatter';
const stationId = uni.getStorageSync('stationId');
const selectItems = ref<'Committed' | 'Rejected' | 'Solved'>('Committed');
const handleSelectChange = ({ detail: { value } }) => {
  selectItems.value = value;
};

onLoad(() => {
  uni.getSetting({
    withSubscriptions: true,
    success: (res) => {
      if (res.subscriptionsSetting.mainSwitch === false) {
        uni.showToast({
          icon: 'error',
          title: '请允许消息通知',
          duration: 10000,
        });
      }
      if (res.subscriptionsSetting[managerReportSubscribeId] === 'accept') {
        isSubscribed.value = true;
      }
    },
  });
});

onShow(() => {
  reportList.value = [];
  showReportList.value = [];
  reportListPageNum.value = 1;
  isReportListLoading.value = false;
  hasMoreReportList.value = true;
  // getStationReportList();
});
const reportList = ref<ReportItemVO[]>([]);
const showReportList = ref<ReportItemVO[]>([]);
const reportListPageNum = ref(1);
const isReportListLoading = ref(false);
const hasMoreReportList = ref(true);

watch([reportList, selectItems], ([newReportList, newSelectItems]) => {
  showReportList.value = newReportList.filter((report) => newSelectItems.includes(report.status));
  console.log('www', hasMoreReportList.value && !isReportListLoading.value && showReportList.value.length < 5);
  if (hasMoreReportList.value && !isReportListLoading.value && showReportList.value.length < 5) {
    isReportListLoading.value = true;
    getStationReportList();
  }
});

const getStationReportList = async () => {
  console.log('isGettingReport');
  api
    .getStationReportList({
      stationId,
      pageNum: reportListPageNum.value,
      pageSize: 5,
    })
    .then((res) => {
      reportList.value = reportList.value.concat(
        res.data.data
          .filter((report) => {
            return report.status !== 'Created' && report.status !== 'None';
          })
          .map((report) => {
            return {
              // TODO: reportId还没有api 需要等待后端
              ...report,
              createTime: new Date(report.createTime),
              solvedTime: report.solvedTime ? new Date(report.solvedTime) : undefined,
            };
          }),
      );
      if (reportListPageNum.value * 5 >= res.data.total) {
        hasMoreReportList.value = false;
      } else {
        reportListPageNum.value++;
      }
      isReportListLoading.value = false;
      uni.hideLoading();
    });
};

onReachBottom(() => {
  if (hasMoreReportList.value && !isReportListLoading.value) {
    isReportListLoading.value = true;
    getStationReportList();
  }
});

function handleClick(i: number) {
  uni.navigateTo({
    url: '../handleReport/reportDetail/reportDetail',
    success: (res) => {
      res.eventChannel.emit('reportData', { data: showReportList.value[i] });
    },
  });
}
const managerReportSubscribeId = 'PXbaC2t1IAQ8ILtPPre-iz3Nz2-F6kIGqJDn868o1_o';
const isSubscribed = ref(false);
//订阅消息
const subscribeMessage = () => {
  uni.requestSubscribeMessage({
    tmplIds: [managerReportSubscribeId],
    success: (res) => {
      if (res['errMsg'] !== 'requestSubscribeMessage:ok' || res[managerReportSubscribeId] !== 'accept') {
        uni.showToast({
          title: '不订阅无法收到通知',
          icon: 'none',
        });
        return;
      }
      if (!isSubscribed.value) {
        uni.getSetting({
          withSubscriptions: true,
          success: (res) => {
            if (res.subscriptionsSetting.mainSwitch === false) {
              uni.showToast({
                icon: 'error',
                title: '请允许消息通知',
                duration: 10000,
              });
            }
            if (res.subscriptionsSetting[managerReportSubscribeId] === 'accept') {
              isSubscribed.value = true;
            }
          },
        });
      }
    },
    fail: (err) => {
      console.log('🚀 ~ file: handleReport.vue:165 ~ subscribeMessage ~ err:', err);
    },
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

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contain-box {
  background-color: rgba(230, 230, 230);
  box-shadow: 0px 5px 20px 0px rgba(161, 161, 161);
  padding-top: 50rpx;
  margin-top: 40rpx;
  width: 88%;
  border-radius: 30rpx;
}

.picture {
  width: 280rpx;
  height: 140rpx;
  margin-left: 15rpx;
  background-color: gray;
  border-radius: 30rpx;
  box-shadow: 0px 5px 10px 2px rgba(161, 161, 161);
}

.reason {
  font-size: 24rpx;
  width: 280rpx;
  height: 140rpx;
  overflow-y: hidden;
  margin-left: 28rpx;
}

.reason-shorten {
  font-size: 24rpx;
  width: 280rpx;
  overflow-y: hidden;
  margin-left: 28rpx;
}

.reportMessage {
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 6rpx;
  margin-top: 26rpx;
}

.arrow-right {
  width: 50rpx;
  height: 100rpx;
  transform: scaley(2);
  position: relative;
  left: 20rpx;
  top: 15rpx;
}

.result-reject {
  font-size: 35rpx;
  position: relative;
  left: 30rpx;
  top: 15rpx;
  color: brown;
}

.result-pass {
  font-size: 35rpx;
  position: relative;
  left: 30rpx;
  top: 15rpx;
  color: darkgreen;
}

.handleTime-pass {
  font-size: 23rpx;
  position: relative;
  left: 30rpx;
  top: 20rpx;
  color: darkgreen;
}

.handleTime-reject {
  font-size: 23rpx;
  position: relative;
  left: 30rpx;
  top: 20rpx;
  color: brown;
}

.submit {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0052d9;
  width: calc(100vw - 32px);
  margin: 16px;
  flex-direction: column;
  color: #fff;
  border-radius: 2px;
  font-size: 16px;
}
</style>
