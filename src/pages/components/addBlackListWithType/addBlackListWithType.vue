<template>
  <view class="ctn">
    <div style="font-size: 16px; font-weight: bold; margin-bottom: 16px">添加黑名单</div>

    <div class="input_ctn">
      <div class="content_ctn">
        <div class="text">电动车：</div>
        <input
          v-model="scooterCode"
          class="input"
          placeholder="请输入电动车编号"
          placeholder-class="input-placeholder"
        />
      </div>

      <div class="content_ctn">
        <div class="text">原因：</div>
        <input v-model="reason" placeholder="请输入原因" class="input" />
      </div>

      <div class="content_ctn">
        <div class="text">解封时间：</div>
        <uni-datetime-picker v-model="due" return-type="timestamp" />
      </div>
    </div>
    <button type="warn" @click="sendToBlackList">加入黑名单</button>
  </view>
</template>

<script lang="ts" setup>
import api from '@/api';
import { ref } from 'vue';
const due = ref(new Date().getTime());
const scooterCode = ref('');
const reason = ref('');
const codeRegular = /^[A-Z]\d{1,4}$/;

const sendToBlackList = () => {
  if (!codeRegular.test(scooterCode.value)) {
    uni.showToast({ title: '电动车编号错误', icon: 'error' });
    return;
  } else if (!reason.value) {
    uni.showToast({ title: '请输入原因', icon: 'error' });
    return;
  } else if (due.value < new Date().getTime()) {
    uni.showToast({ title: '解封时间不能早于当前时间' });
    return;
  }
  api
    .sendToBlackList(reason.value, due.value, undefined, undefined, scooterCode.value)
    .then(() => {
      uni.showToast({ title: '添加成功', icon: 'success' });
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'error',
      });
    });
};
</script>

<style scoped>
.ctn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 5px;
}

.input_ctn {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.input {
  width: 100%;
  height: auto !important ;
  min-height: 20px;
  padding: 10px;
  font-size: 16px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 5px;
}

.content_ctn {
  display: flex;
  gap: 8px;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  align-content: center;
}

.text {
  width: 80px;
  flex-shrink: 0;
}
</style>
