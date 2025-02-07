<template>
  <div class="ctn">
    <div v-if="isShowDelete" class="deleteHolder" @click="deletePic">
      <image class="delete" src="/static/shanchu.svg" mode="scaleToFill" />
    </div>
    <image :src="photoUrl" mode="aspectFit" style="height: 100%; width: 100vw" @click="changeTitle" />
  </div>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref, getCurrentInstance } from 'vue';

const photoUrl = ref('');
onLoad(() => {
  const instance = getCurrentInstance()?.proxy;
  const eventChannel = instance.getOpenerEventChannel();
  eventChannel.once('previewPhotoUrl', (data) => {
    photoUrl.value = data.photoUrl;
  });
});

const isShowDelete = ref(true);
const deletePic = () => {
  uni.showActionSheet({
    title: '要删除这张照片吗？',
    itemList: ['删除'],
    itemColor: 'red',
    success: () => {
      uni.$emit('deleteUrl', { deleteUrl: photoUrl.value });
      uni.navigateBack({});
    },
  });
};
const changeTitle = () => {
  isShowDelete.value = !isShowDelete.value;
};
</script>

<style scoped>
.ctn {
  width: 100vw;
  height: 100vh;
  background-color: black;
}

.deleteHolder {
  position: absolute;
  width: 48px;
  height: 32px;
  top: 8px;
  right: 0px;
  background-color: red;
  backdrop-filter: blur(8px);
  border-radius: 16px 0px 0px 16px;
}

.delete {
  width: 16px;
  height: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
}
</style>
