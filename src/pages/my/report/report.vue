<template>
  <div class="header">
    <p>hi，小马</p>
    <p>请描述您的问题或建议，</p>
    <p>我们会在第一时间向您反馈。</p>
  </div>
  <div class="inputarea">
    <textarea v-model="textContent" placeholder="请输入" style="padding-left: 3vw; padding-right: 3vw; padding-top: 20px; width: 82vw;" auto-height="true" @linechange="lineCh" />
    <div style="height: 100px;" />
    <div class="photo" @click="uploadPhoto">
      <image :src="(newPicturePath != '')?newPicturePath :'../../../static/avatar.png'" style="height: calc(25vmin - 20px); width: calc((25vmin - 20px));" />
    </div>
  </div>
  <div class="submit" @click="uploadForm">
    <span>提交问题</span>
  </div>
  <div class="about">
    <span style="font-weight: bold; font-size: 1.2rem;">驿夫 v1.0.0</span>
    <span>自强studio技术中心 驿夫项目组</span>
    <span>出品</span>
    <div style="display: flex;">
      <span style="width: 50vw; text-align: center;">联系我们</span>
      <span style="width: 50vw; text-align: center;">加入我们</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const textContent = ref<string>('');
// const textHeight = ref<number>(0);
const newPicturePath = ref<string>('');

const lineCh = (res) => {
  // textHeight.value = res.detail.height;
};

const uploadPhoto = () => {
  uni.showActionSheet({
    itemList: ['更换头像'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.chooseImage({
          sizeType: ['compressed'],
          sourceType: ['album'],
          success: (res) => {
            newPicturePath.value = res.tempFilePaths[0];
          }
        });
      }
    }
  });
};

const uploadForm = () => {
  if (textContent.value === '') {
    uni.showToast({
      icon: 'error',
      title: '请填写内容',
      duration: 500
    });
    return;
  }
  // uni.uploadFile({
  //   url: '',
  // })
  uni.showToast({
    title: '提交成功',
    icon: 'success',
    mask: true,
    duration: 1000
  });
  setTimeout(() => {
    uni.navigateBack();
  }, 1000);
}
</script>

<style lang="less" scoped>
.header {
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: 10vw;
  margin-right: 10vw;
  color: green;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.inputarea {
  margin-left: 7vw;
  margin-right: 7vw;
  border: 2px solid gray;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.photo {
  width: 25vmin;
  height: 25vmin;
  margin-left: 3vw;
  margin-bottom: 10px;
  border: 2px solid gray;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit {
  margin-left: 7vw;
  margin-right: 7vw;
  margin-top: 30px;
  background-color: green;
  color: white;
  height: 30px;
  width: 86vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.about {
  margin-top: 30px;
  width: 100vw;
  background-color: green;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  align-items: center;
}
</style>