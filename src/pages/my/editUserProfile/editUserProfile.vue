<template>
  <div class="header"></div>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app';

const userProfile = uni.getStorageSync('user-profile');
onShow (() => {
  console.log(userProfile);
})
</script>

<style lang="less" scoped>
.header {
  height: 40vh;
  width: 100vw;
  background-color: green;
  display: flex;
  justify-content: center;
  align-items: end;
}
</style>