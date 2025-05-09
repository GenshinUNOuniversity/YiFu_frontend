<template>
  <div class="bg-message">
    <!-- <div class="message" v-for="item in mymessage" :key="item.id">
      <div v-if="item.message_type === 'receive'" style="display: flex;">
        <image :src="item.avatar" style="height: 50px; width: 50px;" />
        <div class="bubble">{{ item.message }}</div>
      </div>
      <div v-else style="display: flex; flex-direction: row-reverse;">
        <image :src="item.avatar" style="height: 50px; width: 50px;" />
        <div class="bubble">{{ item.message }}</div>
      </div>
    </div> -->
    <div class="message">
      <div style="display: flex; gap: 3vw; margin-left: 3vw; margin-right: 3vw;">
        <image src="../../../static/avatar.png" style="height: 10vmin; width: 10vmin;" />
        <div class="bubble">hello hello hello hello hello hello hello hellohellohellohellohellohellohellohello!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</div>
      </div>
    </div><div class="message">
      <div style="display: flex; gap: 3vw; margin-left: 3vw; margin-right: 3vw;">
        <image src="../../../static/avatar.png" style="height: 10vmin; width: 10vmin;" />
        <div class="bubble">hello hello hello hello hello hello hello hellohellohellohellohellohellohellohello!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</div>
      </div>
    </div>
    <div style="height: 200px;" />
  </div>
  <div class="bg-bar">
    <div style="height: 10px;" />
    <div class="contact">
      <span>电话联系对方</span>
    </div>
    <div style="display: flex; width: 100vw; height: calc(textHeight); align-items: center;">
      <textarea v-model="newMessage" placeholder="点击输入信息" auto-height="true" @linechange="lineCh" />
      <div class="send" @click="send">发送</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api';
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app';
import { MessageVO } from '@/api/message';
import { ref } from 'vue';

const message = ref<MessageVO[]>([]);
const mymessage = ref<MessageVO[]>([]);
const userid = ref<string>('');
const newMessage = ref<string>('');
const textHeight = ref<number>(0);
var timer: ReturnType<typeof setTimeout> | null = null;

onLoad((res) => {
  // console.log('messagedetail:onload');
  // console.log(res.userid);
  userid.value = res.userid;
  uni.setNavigationBarTitle({
    title: userid.value
  });
  message.value = uni.getStorageSync('message');
});

onShow(() => {
  // console.log('messagedetail:onshow');
  // timer = setInterval(() => {
  //   console.log("timer");
  //   // api.getMessage().then((res) => {
  //   //   message.value = res.data;
  //   //   mymessage.value = message.value.filter((item) => {
  //   //     return (item.send_user === userid.value || item.receive_user === userid.value);
  //   //   });
  //   // });
  // }, 500);
});

onUnload(() => {
  // console.log('messagedetail:onunload');
  // if (timer) {
  //   clearInterval(timer);
  //   timer = null;
  // }
  uni.setStorageSync('message', message.value);
});

const send = () => {
  if (newMessage.value === '' || newMessage === undefined) {
    uni.showToast({
      duration: 500,
      title: '请输入信息',
      icon: 'error'
    });
    return;
  }
  api.sendMessage(userid.value, newMessage.value).then(() => {
    uni.showToast({
      title: '已发送',
      icon: 'success',
      duration: 500
    });
    newMessage.value = '';
  }).catch(() => {
    uni.showToast({
      title: '发送失败',
      icon: 'error',
      mask: true,
      duration: 500
    })
  });
};

const lineCh = (res) => {
  textHeight.value = res.detail.height;
  // console.log(textHeight.value);
};
</script>

<style lang="less" scoped>
textarea {
  margin-left: 7vw;
  margin-right: 7vw;
  // width: calc(100vw - 70px);
  // border: red solid 1px;
  border-radius: 10px;
  background-color: white;
  padding-top: 5px;
  padding-bottom: 5px;
}

.bubble {
  // width: calc(100vw - 100px);
  width: 60vw;
  border-radius: 10px;
  background-color: white;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  white-space: pre-line;
  // word-break: break-all;
  word-wrap: break-word;
  // overflow-wrap: break-word;
}

.bg-message {
  min-height: 100vh;
  width: 100vw;
  background-color: rgb(88, 187, 88);
  z-index: 0;
}

.bg-bar {
  width: 100vw;
  // border: red solid 2px;
  padding-bottom: 20px;
  background-color: rgb(88, 187, 88);
  // height: 150px;
  position: fixed;
  bottom: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1;
}

.message {
  width: 100vw;
  // display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
}

.send {
  border-radius: 5px;
  background-color: green;
  color: white;
  height: 25px;
  width: 50px;
  text-align: center;
}

.contact {
  height: 40px;
  width: 86vw;
  margin-left: 7vw;
  margin-right: 7vw;
  background-color: green;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
</style>