<template>
  <div class="input">
    <p v-if="type === 'profile'">手机号</p>
    <div style="display: flex; flex-direction: row; justify-content: stretch; align-items: center">
      <picker
        v-if="!phoneNum"
        :range="prefixArr"
        :value="prefixIndex"
        range-key="label"
        class="prefix"
        disabled
        @change="handlePrefixChange($event.detail.value)"
        >{{ prefix }}</picker
      >
      <input
        v-model="localPhone"
        :disabled="isChangeSuccess"
        style="flex-grow: 1; flex-shrink: 1"
        type="tel"
        placeholder="请输入"
        :maxlength="11"
        @focus="handleInputPhoneFocus"
        @blur="handleInputPhoneBlur"
        @input="updatePhone($event.detail.value)"
      />
      <button v-if="isChangeSuccess" class="bind-phone" disabled>
        {{ type === 'change' ? '修改成功' : '获取成功' }}
      </button>

      <button
        v-else-if="!isInputNumber"
        class="bind-phone"
        open-type="getPhoneNumber"
        hover-class="button-hover"
        @getphonenumber="getPhoneNumber"
      >
        从微信获取
      </button>
      <button v-else class="bind-phone" hover-class="button-hover" @click="getUserPhoneCode">
        {{ isWaiting ? timeWait + '秒后再次发送' : '发送验证码' }}
      </button>
    </div>
  </div>
  <div v-if="isInputNumber" id="code" class="input show" style="margin-top: -20px">
    <p>验证码</p>
    <div style="display: flex; flex-direction: row; justify-content: stretch; align-items: center">
      <input
        v-model="localCode"
        style="flex-grow: 1"
        type="number"
        placeholder="请输入"
        :maxlength="6"
        @input="updateCode($event.detail.value)"
      />
      <button
        v-if="type === 'change'"
        :disabled="!/\d{6}/.test(localCode) && !isRequestCode"
        class="bind-phone"
        @click="changeUserPhoneByCode"
      >
        修改
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import api from '@/api';
import { ref, watch } from 'vue';
import { checkPhoneReg, PhonePrefix } from '@/utils/phonePrefix';

const localPhone = ref('');
const isInputNumber = ref(false);
const isChangeSuccess = ref(false);
const timeWait = ref(0);
const startTime = ref<Date>();
const isWaiting = ref(false);
const localCode = ref('');
let timeout: number;
const isRequestCode = ref(false);
const prefix = ref('+86');
const prefixIndex = ref(0);
const prefixArr = [
  { label: '中国大陆（+86）', code: PhonePrefix.China },
  { label: '中国香港（+852）', code: PhonePrefix.HongKong },
  { label: '中国澳门（+853）', code: PhonePrefix.Macao },
  { label: '中国台湾（+886）', code: PhonePrefix.Taiwan },
];

const emit = defineEmits(['update:phone', 'update:code', 'wxPhoneCode', 'prefix']);
const props = defineProps<{
  success: boolean;
  phoneNum: string;
  type: 'change' | 'profile';
}>();

watch(
  () => props.success,
  (value) => {
    console.log(value);

    if (value) {
      updateCode('');
      isChangeSuccess.value = true;
      if (props.phoneNum) {
        updatePhone(props.phoneNum);
      }
    }
  },
);

const handlePrefixChange = (index: number) => {
  prefixIndex.value = index;
  prefix.value = prefixArr[prefixIndex.value].code;
  emit('prefix', prefix.value);
};

const updatePhone = (value: string) => {
  localPhone.value = value;
  emit('update:phone', value);
};

const updateCode = (value: string) => {
  localCode.value = value;
  emit('update:code', value);
};

const countDown = () => {
  if (startTime.value && startTime.value.getTime() + 60 * 1000 <= new Date().getTime() && isWaiting.value) {
    isWaiting.value = false;
    startTime.value = undefined;
  } else {
    isWaiting.value = true;
    if (!startTime.value) {
      startTime.value = new Date();
    }
    timeWait.value = Math.floor((startTime.value.getTime() + 60 * 1000 - new Date().getTime()) / 1000);
    timeout = setTimeout(() => {
      countDown();
    }, 1000);
  }
};
const handleInputPhoneFocus = () => {
  isInputNumber.value = true;
};
const handleInputPhoneBlur = () => {
  if (localPhone.value.length === 0) {
    isInputNumber.value = false;
  }
};

const getPhoneNumber = (e: { detail: { code: string; errMsg: string } }) => {
  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({
      icon: 'error',
      title: '获取手机号失败',
    });
    return;
  }
  emit('wxPhoneCode', e.detail.code);
};

const getUserPhoneCode = () => {
  if (isWaiting.value) {
    uni.showToast({
      icon: 'error',
      title: `请等待${timeWait.value}秒`,
    });
    return;
  }
  if (!checkPhoneReg(prefixArr[prefixIndex.value].code, localPhone.value)) {
    uni.showToast({
      icon: 'error',
      title: '手机号格式错误',
    });
    return;
  }
  api
    .getUserPhoneCode(encodeURIComponent(`${prefix.value}-${localPhone.value}`))
    .then(() => {
      uni.showToast({
        icon: 'success',
        title: '验证码已发送',
      });
      isRequestCode.value = true;
      countDown();
    })
    .catch((err) => {
      uni.showToast({
        icon: 'none',
        title: err.message,
      });
      if (timeout) {
        clearTimeout(timeout);
      }
      isWaiting.value = false;
      timeWait.value = 0;
    });
};

const changeUserPhoneByCode = () => {
  if (!checkPhoneReg(prefixArr[prefixIndex.value].code, localPhone.value)) {
    uni.showToast({
      icon: 'error',
      title: '手机号格式错误',
    });
    return;
  }
  if (!/\d{6}/.test(localCode.value)) {
    uni.showToast({
      icon: 'error',
      title: '验证码格式错误',
    });
    return;
  }
  api
    .changeUserPhone(localCode.value, 'code', localPhone.value)
    .then(() => {
      uni.showToast({
        icon: 'success',
        title: '手机号修改成功',
      });
      isChangeSuccess.value = true;
      isInputNumber.value = false;
    })
    .catch((err) => {
      uni.showToast({
        icon: 'none',
        title: err.message,
      });
      return;
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
