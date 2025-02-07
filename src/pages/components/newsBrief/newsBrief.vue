<template>
  <div class="notification" @click="clickNotification">
    <image :src="news.briefPicUrl" mode="aspectFit" class="notificationimage" />
    <div class="notificationmain">
      <p style="font-size: 32rpx; font-weight: bold; color: #3d3d3d">
        {{ news.title }}
      </p>
      <p
        style="
          font-size: 24rpx;
          font-weight: normal;
          line-height: 34rpx;
          letter-spacing: 0em;
          color: #3d3d3d;
          padding-bottom: 10rpx;
        "
      >
        {{ dateTimeFormatter(news.createTime) }}
      </p>
      <p style="font-size: 24rpx; font-weight: normal; width: 660rpx; color: rgba(0, 0, 0, 0.4)">
        {{ news.brief }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NewsBriefVO } from '@/api/news';
import { dateTimeFormatter } from '@/utils/timeformatter';

const props = defineProps<{ news: NewsBriefVO }>();

const clickNotification = () => {
  uni.navigateTo({ url: `/pages/components/news/news?newsId=${props.news.newsId}` });
};
</script>

<style scoped>
.notification {
  font-size: 32rpx;
  font-weight: bold;
  height: 406rpx;
  margin-top: 16rpx;
  background: #fff;
  margin-bottom: 24rpx;
}

.notificationimage {
  height: 218rpx;
  width: 698rpx;
  margin-bottom: 6rpx;
}

.notificationmain {
  margin-left: 20rpx;
  margin-right: 20rpx;
}
</style>
