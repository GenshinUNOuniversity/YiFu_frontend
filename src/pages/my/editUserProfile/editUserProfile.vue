<template>
  <div class="header">
    <image :src="(changePicture)? newPicturePath : (userProfile?.avatarUrl || '../../../static/avatar.png')"
    @click="uploadPicture"
    style="height: 20vmin; width: 20vmin;" />
    <div style="text-align: center; color: white;">ID: {{ userProfile?.userId || 'unknown' }}</div>
  </div>
  <div>
    <div class="rows">
      <div class="row">
        <label for="nickname">昵称</label>
        <input id="nickname" type="text" v-model="newNickname" placeholder="请输入新的昵称" @input="nicknameIsMissing = false;"/>
      </div>
      <span class="alert" v-if="nicknameIsMissing">请填写昵称</span>
      <div class="row">
        <label for="phone">联系方式</label>
        <input id="phone" type="text" v-model="newPhone" placeholder="请输入新的联系方式" @input="phoneIsMissing = false;"/>
      </div>
      <span class="alert" v-if="phoneIsMissing">请填写联系方式</span>
      <div class="row">
        <label for="faculty">学部</label>
        <picker id="faculty" mode="selector" :range="facul" :value="index" @change="changeFaculty">
          <span class="uni-input">{{ facul[index] }}</span>
        </picker>
      </div>
    </div>
    <div class="submit-button" @click="uploadForm">提交</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { UserProfileVO } from '@/api/user';
import { onShow } from '@dcloudio/uni-app';

const facul = ['文理学部','工学部','信息学部','医学部','网安基地'];
const index = ref(0);
const userProfile = ref<UserProfileVO>();
const changePicture = ref(false);
const newPicturePath = ref<string>();
const newNickname = ref<string>();
const newPhone = ref<string>();
const nicknameIsMissing = ref(false);
const phoneIsMissing = ref(false);

onShow (() => {
  userProfile.value = uni.getStorageSync<UserProfileVO>('user-profile');
  console.log("editUserProfile: onshow");
});

const uploadPicture = () => {
  uni.showActionSheet({
    itemList: ['更换头像'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.chooseImage({
          sizeType: ['compressed'],
          sourceType: ['album'],
          success: (res) => {
            changePicture.value = true;
            newPicturePath.value = res.tempFilePaths[0];
          }
        });
      }
    }
  });
};

const uploadForm = () => {
  console.log(newNickname.value, newPhone.value);
  var havetochange = false;
  if (newNickname.value === undefined || newNickname.value === '') {
    havetochange = true;
    nicknameIsMissing.value = true;
  }
  if (newPhone.value === undefined || newPhone.value === '') {
    havetochange = true;
    phoneIsMissing.value = true;
  }
  if (havetochange) {
    return;
  }
  /*uni.uploadFile({
    url: '',
    filePath: newPicturePath.value,
    name: 'avatar',
    formData: {
      'nickname': newNickname.value,
      'phone': newPhone.value,
      'faculty': facul[index.value]
    },
    success: () => {
      uni.showToast({
        title: '提交成功',
        icon: 'success',
        mask: true
        duration: 1000
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1000);
    }
  });*/
  uni.showToast({
    title: '提交成功',
    icon: 'success',
    mask: true,
    duration: 1000
  });
  setTimeout(() => {
    uni.navigateBack();
  }, 1000);
};

const changeFaculty = (res) => {
  // console.log(res);
  // console.log(res.detail.value);
  index.value = res.detail.value;
};
</script>

<style lang="less" scoped>
label {
  padding-left: 20px;
  width: 40vw;
  text-align: left;
  color: green;
  // border: purple solid 1px;
}

input {
  padding-right: 20px;
  width: 60vw;
  // border: red solid 1px;
}

.alert {
  font-size: 0.7rem;
  color: red;
}

.header {
  height: 40vh;
  width: 100vw;
  background-color: green;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.rows {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.row {
  height: 40px;
  width: 86vw;
  margin-top: 20px;
  border-bottom: 2px gray solid;
  display: flex;
  justify-content: left;
  align-items: center;
}

.submit-button {
  // border: 1px red solid;
  // height: 30px;
  margin-top: 30px;
  width: 100vw;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  text-align: center;
}
</style>