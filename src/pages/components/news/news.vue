<template>
  <div class="ctn">
    <h1 style="font-size: 22px; font-weight: 400">{{ news?.title }}</h1>
    <h2 style="font-size: 15px; color: #b2b2b2">创建时间：{{ dateTimeFormatter(news?.createTime!) }}</h2>
    <rich-text style="font-size: 15px; width: 100%; overflow: hidden" :nodes="news?.content"></rich-text>
  </div>
</template>

<script lang="ts" setup>
import api from '@/api';
import { NewsDetailVO } from '@/api/news';
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { dateTimeFormatter } from '@/utils/timeformatter';

const news = ref<NewsDetailVO>();

onLoad((options) => {
  if (options.newsId) {
    api.getNewsDetail({ newsId: Number(options.newsId) }).then((res) => {
      news.value = { ...res.data, createTime: new Date(res.data.createTime) };
    });
  }
});
</script>

<style scoped>
.ctn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px;
  gap: 8px;
}
</style>
