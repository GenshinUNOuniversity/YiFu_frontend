<template>
  <div v-if="noData" class="loading">无数据</div>
  <div v-else-if="isLoading" class="loading">Loading...</div>
  <div v-else-if="!hasMore" class="loading">- THE END -</div>
</template>

<script lang="ts" setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  hasMore: {
    type: Boolean,
    default: true,
  },
  noData: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #c1c0c0;
  height: 100%;
  padding: 16px;
}
</style>
