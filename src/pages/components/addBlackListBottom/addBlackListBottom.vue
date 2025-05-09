<template>
  <button :disabled="!(scooterId || userId || scooterCode)" type="warn" @click="sendToBlackList">
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
import api from '@/api';
import { ref } from 'vue';

const props = defineProps<{
  scooterId?: number;
  userId?: number;
  scooterCode?: boolean;
}>();

const due = ref(new Date().getTime());
const reason = ref('');
const codeRegular = /^[A-Z]\d{1,4}$/;
const enterScooterCode = ref('');

const userType = () => {
  uni.showModal({
    title: '请输入加入黑名单原因',
    editable: true,
    placeholderText: '请输入原因',
    success: (res) => {
      if (res.confirm) {
        if (res.content === '' || !res.content) {
          uni.showToast({ title: '请输入原因', icon: 'error' });
          return;
        } else {
          reason.value = res.content;
          uni.showModal({
            title: '请输入黑名单天数',
            editable: true,
            placeholderText: '请输入天数',
            success: (res) => {
              if (res.confirm) {
                if (res.content === '' || !res.content) {
                  uni.showToast({ title: '请输入天数', icon: 'error' });
                  return;
                } else if (!/^[0-9]+$/.test(res.content)) {
                  uni.showToast({ title: '请输入正确的天数', icon: 'error' });
                  return;
                } else {
                  due.value = new Date().getTime() + 8640000 * Number(res.content);
                  api
                    .sendToBlackList(
                      reason.value,
                      due.value,
                      props.userId,
                      props.scooterId,
                      props.scooterCode ? enterScooterCode.value : undefined,
                    )
                    .then(() => {
                      uni.showToast({ title: '添加成功', icon: 'success' });
                    })
                    .catch((err) => {
                      uni.showToast({
                        title: err.message,
                        icon: 'none',
                      });
                    });
                }
              } else {
                return;
              }
            },
          });
        }
      } else {
        return;
      }
    },
  });
};

const sendToBlackList = () => {
  if (props.scooterCode) {
    uni.showModal({
      title: '请输入加入黑名单的车辆',
      editable: true,
      placeholderText: '请输入电动车编号',
      success: ({ confirm, content }) => {
        if (confirm) {
          if (codeRegular.test(content!)) {
            enterScooterCode.value = content!;
            userType();
          } else {
            uni.showToast({ title: '电动车编号错误', icon: 'error' });
            return Promise.reject();
          }
        }
      },
    });
  } else {
    userType();
  }
};
</script>

<style scoped></style>
