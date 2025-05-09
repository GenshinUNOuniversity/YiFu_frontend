<template>
  <div style="margin-left: 7vw; margin-right: 7vw;">
    <radio-group @change="show">
      <p style="margin-top: 5px; margin-bottom: 5px;">
        <radio value="0" />充电桩未被占用/其他无需挪车的情况
      </p>
      <p style="margin-top: 5px; margin-bottom: 5px;">
        <radio value="1" />自行挪车/由管理员挪车
      </p>
      <p style="margin-top: 5px; margin-bottom: 5px;">
        <radio value="2" />无法挪车
      </p>
    </radio-group>
  </div>
  <div v-if="option==1" class="main">
    <p style="font-size: 1.2rem; color: green; font-weight: bold;">武汉大学{{ stations[id].name }}</p>
    <p style="color: green;">车辆编号：{{ scooterinfo.code }}</p>
    <div style="height: 30px;" />
    <div class="photo" @click="uploadPhoto">
      <image :src="(newPicturePath != '')?newPicturePath :'../../../static/avatar.png'"
      style="height: calc(25vmin - 20px); width: calc((25vmin - 20px));" />
    </div>
    <textarea v-model="textContent" placeholder="请输入挪车备注，将展示给该车的车主"
    style="padding-left: 3vw; padding-right: 3vw; padding-top: 20px; width: 75vw;"
    auto-height="true" maxlength="30" />
  </div>
  <div style="width: 100vw; display: flex; justify-content: center; margin-top: 20px;">
    <div :class="(option==4) ? 'submit-unavailable' : 'submit-available'" @click="submit">提交</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow, onLoad } from '@dcloudio/uni-app';
import api from '@/api'
import { ScooterProfileVO } from '@/api/scooter';

const id = ref<number>(0);
const option = ref<number>(4);
const scooterinfo = ref<ScooterProfileVO>({});
const stations = [{
  name: '信息学部充电站',
  address: '信息学部7舍楼下'
}];
const newPicturePath = ref<string>('');
const textContent = ref<string>('');

onLoad((res) => {
  id.value = res.stationId;
  // console.log('res: '+res.stationId);
});

onShow(() => {
  scooterinfo.value = uni.getStorageSync('scooterinfo');
  // console.log(scooterinfo.value);
  // console.log('id: '+option.value+id.value);
});

const show = (res) => {
  // console.log(res.detail.value);
  option.value = res.detail.value;
};

const uploadPhoto = () => {
  uni.showActionSheet({
    itemList: ['上传照片'],
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

const submit = () => {
  if (option.value==4) {
    uni.showToast({
      title: '请选择挪车情况',
      icon: 'error',
      mask: false,
      duration: 500
    });
  }
  else if (option.value==2) {
    uni.showModal({
      title: '提示',
      content: '前车用户将会被扣除信用分，是否确认无法挪车？',
      showCancel: true,
      success: ({ confirm, cancel }) => {
        if (confirm) {
          uni.showToast({
            title: '提交成功',
            icon: 'success',
            mask: true,
            duration: 500
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 500);
        }
      }
    });
  }
  else if (option.value==1) {
    if (newPicturePath.value=='') {
      uni.showToast({
        title: '请提交挪车照片',
        icon: 'error',
        mask: false,
        duration: 500
      });
    }
    else if (textContent.value=='') {
      uni.showToast({
        title: '请提交挪车备注',
        icon: 'error',
        mask: false,
        duration: 500
      });
    }
    else {
      uni.showToast({
        title: '提交成功',
        icon: 'success',
        mask: true,
        duration: 500
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 500);
    }
  }
  else {
    uni.showToast({
      title: '提交成功',
      icon: 'success',
      mask: true,
      duration: 500
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 500);
  }
};
</script>

<style lang="less" scoped>
.main {
  margin-left: 7vw;
  margin-right: 7vw;
  border: 2px solid gray;
  border-radius: 15px;
  padding-left: 2vw;
  padding-right: 2vw;
  padding-top: 10px;
  padding-bottom: 20px;
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

.submit-available {
  width: 50vw;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
  text-align: center;
  background-color: green;
  border-radius: 10px;
  color: white;
}

.submit-unavailable {
  width: 50vw;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
  text-align: center;
  background-color: rgb(109, 122, 109);
  border-radius: 10px;
  color: white;
}
</style>