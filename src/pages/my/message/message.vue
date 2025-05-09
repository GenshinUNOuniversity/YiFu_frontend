<template>
  <div class="bg">
    <!-- <span>background</span> -->
    <div class="link" @click="gotoDetail('12')">
      <image src="../../../static/avatar.png" style="height: 50px; width: 50px;"/>
      <div>
        <p class="title"><b>系统通知</b></p>
        <p class="convey">【取车通知】您的电动车已经充好电</p>
      </div>
    </div>
    <div class="link" v-for="item in contacts" :key="item.userid" @click="gotoDetail(item.userid)">
      <image :src="item.avatar" style="height: 50px; width: 50px;" />
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api';
import { ContactVO, MessageVO } from '@/api/message';
import { onBackPress, onHide, onLoad, onShow, onUnload } from '@dcloudio/uni-app';
import { ref } from 'vue';

const message = ref<MessageVO[]>([]);
const contacts = ref<ContactVO[]>([]);
var timer: ReturnType<typeof setTimeout> | null = null;

onLoad(() => {
  message.value = uni.getStorageSync('message');
});

onShow(() => {
  // message.value = uni.getStorageSync('message');
  // console.log('message:onshow');
  timer = setInterval(() => {
    console.log("timer");
    /*api.getMessage().then((res) => {
      message.value = res.data;
      contacts.value = [];
      if (message.value.length > 0) {
        if (message.value[0].message_type === 'send') {
          contacts.value.push({userid: message.value[0].receive_user, avatar: message.value[0].avatar});
        }
        else {
          contacts.value.push({userid: message.value[0].send_user, avatar: message.value[0].avatar});
        }
      }
      for (var i = 1; i < message.value.length; i++) {
        if (message.value[i].message_type === 'send') {
          if (message.value[i].receive_user !== contacts.value[contacts.value.length-1].userid) {
            contacts.value.push({userid: message.value[i].receive_user, avatar: message.value[i].avatar});
          }
        }
        else {
          if (message.value[i].send_user !== contacts.value[contacts.value.length-1].userid) {
            contacts.value.push({userid: message.value[i].send_user, avatar: message.value[i].avatar});
          }
        }
      }
    });*/
  }, 1000);
});

onBackPress(() => {
  // console.log("message:onbackpress");
  if (timer) {
    clearInterval(timer);
    timer = null;
    // uni.setStorageSync('message', message.value);
  }
});

onHide(() => {
  // console.log("message:onhide");
  if (timer) {
    clearInterval(timer);
    timer = null;
    // uni.setStorageSync('message', message.value);
  }
});

onUnload(() => {
  // console.log("message:onunload");
  if (timer) {
    clearInterval(timer);
    timer = null;
    // uni.setStorageSync('message', message.value);
  }
});

const gotoDetail = (id: string) => {
  if (timer) {
    clearInterval(timer);
    timer = null;
    // uni.setStorageSync('message', message.value);
  }
  uni.navigateTo({
    url: `./messageDetail?userid=${id}`
  })
}
</script>

<style lang="less" scoped>
.bg {
  height: 100vh;
  width: 100vw;
  background-color: rgb(88, 187, 88);
}

.link {
  // border: red solid 1px;
  height: 50px;
  width: 100vw;
  padding-left: 7vw;
  padding-right: 7vw;
  display: flex;
  justify-content: left;
  gap: 3px;
}

.title {
  font-size: 1.5rem;
}
.convey {
  color: white;
}
</style>