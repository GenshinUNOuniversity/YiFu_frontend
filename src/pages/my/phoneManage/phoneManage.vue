<template>
  <view class="title">修改手机号</view>
  <ProfilePhoneInput
    v-model:phone="phoneNum"
    v-model:code="code"
    type="change"
    :success="isChangeSuccess"
    :phone-num="wxPhone"
    @wx-phone-code="getWxPhoneNumber"
  />
  <view class="title">注销帐号</view>
  <button type="warn" style="width: 80%" @click="jumpDeleteAccount">注销帐号</button>
</template>

<script lang="ts" setup>
import api from '@/api';
import { ref } from 'vue';
import ProfilePhoneInput from '@/pages/components/profilePhoneInput/profilePhoneInput';

const wxPhone = ref('');
const phoneNum = ref('');
const isChangeSuccess = ref(false);
const code = ref('');

const getWxPhoneNumber = (code: string) => {
  api.changeUserPhone(code, 'wechat').then(() => {
    api.getUserInfo().then((res) => {
      phoneNum.value = res.data.info.phone;
      isChangeSuccess.value = true;
      wxPhone.value = res.data.info.phone;
      uni.showToast({
        icon: 'success',
        title: '手机号修改成功',
      });
    });
  });
};

const jumpDeleteAccount = () => {
  uni.navigateTo({
    url: '../deleteAccount/deleteAccount',
  });
};
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 50rpx;
  margin-top: 64rpx;
  margin-bottom: 50rpx;
}
.prefix {
  padding: 5px;
  margin-right: 5px;
  background-color: #e4e4e4;
  font-size: 14px;
  color: #333;
  border-right: 1px solid #ccc;
}

.input {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: auto;
  height: 58px;
  background-color: #fff;
  margin-bottom: 13px;
  padding: 8px 12px;
  font-size: 16px;
}

.bind-phone {
  font-size: 16px;
  color: #808080;
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
}
</style>
