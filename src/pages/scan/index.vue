<template>
  <div style="height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center;">
    <div @click="scan">点击扫码</div>
  </div>
</template>

<script setup lang="ts">
const scan = () => {
  uni.scanCode({
    onlyFromCamera: true,
    scanType: ['qrCode'],
    success: ({ result, scanType, charSet, path }) => {
      console.log(result);
    },
    fail: (error) => {}
  });
}
</script>

<style lang="less" scoped>
</style>