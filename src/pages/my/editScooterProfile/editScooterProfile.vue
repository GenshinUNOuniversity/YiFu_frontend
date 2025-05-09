<template>
  <div class="isEditing" v-if="isEditing">
    <!-- <div class="rows"> -->
      <div class="row">
        <input style="padding-left: 10px;" v-model="newName" :placeholder="(isCreating)?'请填写名称':scooter?.name" @input="nameMissing = false;" />
      </div>
      <p class="alert" v-if="nameMissing">请填写小马的名称</p>
      <image class="avatar" :src="(newPicturePath!='')?newPicturePath:scooter?.avatarUrl" mode="scaleToFill" @click="changePicture" />
      <div class="row">
        <label for="code">车辆编码</label>
        <input id="code" type="text" v-model="newCode" :placeholder="(isCreating)?'请填写车辆在校内的编码':scooter?.code" @input="codeMissing = false;" />
      </div>
      <p class="alert" v-if="codeMissing">请填写小马的校内编号</p>
      <div class="row-note">
        <label for="note">挪车备注</label>
        <textarea
          id="note"
          v-model="newNote"
          :placeholder="(isCreating)?'将展示给管理员和下一位使用者':scooter?.moveNotes"
          @input="noteMissing = false;"
          auto-height="true"
          @linechange="lineCh"
        />
      </div>
      <p class="alert" v-if="noteMissing">请填写挪车备注</p>
      <div class="row">
        <label for="time">充满电所需时间</label>
        <picker id="time" mode="selector" :range="costtime" :value="index" @change="changeTime">
          <span>{{ costtime[index] }}</span>
        </picker>
      </div>
      <div style="width: 80vw; height: 40px; display: flex; justify-content: center; align-items: center;" @click="submitForm">
        <span>确定</span>
      </div>
    <!-- </div> -->
  </div>
  <div class="dont-have-scooter" v-else-if="!haveScooter" @click="isEditing = true; isCreating = true;">
    <span style="color: green;">添加小马</span>
  </div>
  <div class="have-scooter" v-else>
    <div class="row">
      <span style="padding-left: 10px;">{{ scooter?.name }}</span>
    </div>
    <image class="avatar" :src="scooter?.avatarUrl" mode="scaleToFill" />
    <div class="row">
      <label for="code">车辆编码</label>
      <span id="code">{{ scooter?.code }}</span>
    </div>
    <div class="row">
      <label for="note">挪车备注</label>
      <span id="note">{{ scooter?.moveNotes }}</span>
    </div>
    <div class="row">
      <label for="time">充满电所需时间</label>
      <span id="time">{{ scooter?.expectHour + '小时' }}</span>
    </div>
    <div style="width: 80vw; height: 40px; display: flex; justify-content: center; align-items: center;" @click="isEditing = true; isCreating = false;">
      <span>修改车辆信息</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ScooterProfileVO } from '@/api/scooter';
import { onShow } from '@dcloudio/uni-app';

const costtime = ['1小时','2小时','3小时','4小时','5小时','6小时','7小时','8小时','9小时','10小时'];
const index = ref(0);
const scooter = ref<ScooterProfileVO>({
  code: 'X0001',
  name: '小马',
  avatarUrl: '../../../static/avatar.png',
  expectHour: 3,
  moveNotes: '无'
});
const haveScooter = ref(false);
const isEditing = ref(false);
const isCreating = ref(false);
const nameMissing = ref(false);
const codeMissing = ref(false);
const noteMissing = ref(false);
const newName = ref<string>();
const newPicturePath = ref<string>('');
const newCode = ref<string>();
const newNote = ref<string>();
const noteHeight = ref<number>(33);

onShow (() => {
  // scooter.value = uni.getStorageSync<ScooterProfileVO>('scooter');
  console.log(scooter.value);
  if (scooter.value?.name != undefined && scooter.value.name != '') {
    haveScooter.value = true;
  }
});

const changePicture = () => {
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

const changeTime = (res) => {
  index.value = res.detail.value;
};

const lineCh = (res) => {
  // console.log(res.detail.height, res.detail.heightRpx, res.detail.lineCount);
};

const submitForm = () => {
  var needToFill = false;
  if (isCreating) {
    if (newName.value === '' || newName.value === undefined) {
      nameMissing.value = true;
      needToFill = true;
    }
    if (newCode.value === '' || newCode.value === undefined) {
      codeMissing.value = true;
      needToFill = true;
    }
    if (newNote.value === '' || newNote.value === undefined) {
      noteMissing.value = true;
      needToFill = true;
    }
    if (needToFill) {
      return;
    }
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
    isEditing.value = false;
    isCreating.value = false;
  }, 1000);
};
</script>

<style lang="less" scoped>
label {
  height: 30px;
  width: 30vw;
  padding-left: 10px;
  padding-top: 10px;
  // border: 1px purple solid;
  color: green;
}

input {
  height: 40px;
  width: 50vw;
  padding-right: 10px;
  // border: 1px red solid;
  color: black;
}

picker {
  padding-top: 10px;
}

.isEditing {
  width: 86vw;
  margin-left: 7vw;
  margin-right: 7vw;
  margin-top: 15vw;
  border: 2px solid gray;
  border-radius: 20px;
  gap: 2px;
  display: flex;
  flex-direction: column;
}

.dont-have-scooter {
  height: 80px;
  width: 86vw;
  margin-left: 7vw;
  margin-right: 7vw;
  margin-top: 15vw;
  border: 2px solid gray;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.have-scooter {
  width: 86vw;
  margin-left: 7vw;
  margin-right: 7vw;
  margin-top: 15vw;
  border: 2px solid gray;
  border-radius: 20px;
  gap: 2px;
  display: flex;
  flex-direction: column;
}

.avatar {
  border: 2px gray solid;
  border-radius: 4px;
  height: 70px;
  width: 70px;
}

.alert {
  font-size: 0.7rem;
  color: red;
}

.row {
  height: 40px;
  width: 80vw;
  display: flex;
  justify-content: left;
  align-items: center;
}

.row-note {
  min-height: 40px;
  height: calc(noteHeight);
  width: 80vw;
  display: flex;
  justify-content: left;
  align-items: center;
}
</style>