<template>
  <view v-for="report in reports" :key="Number(report.createTime)" class="content">
    <view class="header">
      <view>
        <text class="title">{{ report.title }}</text>
        <text class="create-time">{{ dateFormatter(report.createTime) }}</text>
      </view>
      <view>
        <text class="status" :style="{ color: report.solvedTime ? 'rgba(0, 0, 0, 0.4)' : '#ed7b2f' }">
          {{ report.solvedTime ? '已结束' : '处理中' }}
        </text>
      </view>
    </view>
    <view class="detail">
      <view class="report-content">{{ report.content }}</view>
      <image
        v-for="(photoUrl, index) in report.photoUrlList"
        :key="index"
        :src="photoUrl"
        @click="previewPhoto(photoUrl)"
      />
      <template v-if="report.solvedTime">
        <text class="feedback-title">处理结果</text>
        <text class="feedback-reply">{{ report.solvedReply }}</text>
        <text class="feedback-time">已于{{ dateFormatter(report.solvedTime) }}解决</text>
      </template>
      <text v-else class="feedback-time">已反馈</text>
    </view>
  </view>
  <bottom-loading-prompt :has-more="hasMoreReportList" :is-loading="isReportListLoading" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import api from '@/api';
import { ReportItemVO } from '@/api/report';
import BottomLoadingPrompt from '@/pages/components/bottomLoadingPrompt/bottomLoadingPrompt.vue';

const previewPhoto = (url: string) => {
  if (url === '' || url === null) {
    return;
  }
  uni.previewImage({
    urls: [url],
  });
};

const dateFormatter = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const reports = ref<ReportItemVO[]>([]);
const reportListPageNum = ref(1);
const isReportListLoading = ref(false);
const hasMoreReportList = ref(true);

//TODO: 没有提交的举报记录修改
const getReportList = async () => {
  api
    //TODO DEBUG
    .getPersonalReportList({ pageNum: reportListPageNum.value, pageSize: 10 })
    .then((res) => {
      reports.value = reports.value.concat(
        res.data.data
          .filter((report) => {
            return report.status !== 'None' && report.status !== 'Created';
          })
          .map((report) => {
            report.createTime = new Date(report.createTime);
            if (report.solvedTime) {
              report.solvedTime = new Date(report.solvedTime);
            }
            return report;
          }),
      );
      if (reports.value.length === 0) {
        uni.showModal({
          title: '暂无举报记录',
          content: '你还没有举报哦。',
          showCancel: false,
          success: () => {
            uni.navigateBack();
          },
        });
      }
      if (reportListPageNum.value * 5 >= res.data.total) {
        hasMoreReportList.value = false;
      } else {
        reportListPageNum.value++;
      }
      isReportListLoading.value = false;
      uni.hideLoading();
    })
    .catch((err) => {
      console.error(err);
      uni.hideLoading();
      uni.showToast({
        title: err.data.message,
        icon: 'error',
      });
    });
};

onReachBottom(() => {
  if (hasMoreReportList.value && !isReportListLoading.value) {
    isReportListLoading.value = true;
    getReportList();
  }
});

onLoad(() => {
  uni.showLoading({
    title: '加载中',
  });
  getReportList();
});
</script>

<style scoped lang="less">
@import (less) '@/common/font.css';
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

.title:extend(.font-title2) {
  display: block;
  font-weight: normal;
  color: rgba(0, 0, 0, 0.9);
}

.create-time {
  display: block;
  font-size: 12px;
  color: #9e9e9e;
}

.status:extend(.font-caption) {
  display: block;
}

.detail {
  padding: 10px 14px;

  image {
    height: 50px;
    width: 50px;
    display: block;
    margin: 7px 14px;
  }

  .report-content:extend(.font-body) {
    color: #1a1a1a;
  }

  .feedback-title:extend(.font-caption) {
    color: #1a1a1a;
    font-weight: bold;
    display: block;
  }

  .feedback-reply:extend(.font-caption2) {
    color: #1a1a1a;
    display: block;
  }

  .feedback-time:extend(.font-caption2) {
    margin-top: 3px;
    color: #767676;
    display: block;
  }
}
</style>
