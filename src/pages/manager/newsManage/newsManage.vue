<template>
  <div class="ctn">
    <div class="notifications">
      <div style="align-self: flex-start; width: 698rpx; font-size: 32rpx; font-weight: bold; margin-left: 16px">
        当前公告
      </div>
      <view class="announcement">
        <image src="" mode="scaleToFill" style="width: 30%; height: 162px; background-color: pink" />
        <view class="textRule">
          <view class="announcementTitle">阿姨的温馨提示</view>
          <text class="textContentHidden" @click="showNote"> {{ stationBoard }}</text>
          <view v-if="0" class="watchMore">
            <text style="font-size: 10px">更多</text>
          </view>
        </view>
      </view>
    </div>
    <div v-if="isEditBoard" style="align-self: stretch">
      <div style="align-self: flex-start; width: 698rpx; font-size: 32rpx; font-weight: bold; margin-left: 16px">
        修改公告
      </div>
      <div style="align-self: flex-start; width: 698rpx; font-size: 32rpx; color: red; margin-left: 16px">
        修改不会立即生效，需过一会才会正常显示。
      </div>
      <textarea v-model="editBoard" class="input" placeholder="请输入新公告" auto-height :maxlength="-1" />
      <div class="edit-button">
        <button class="button" style="width: 100%; background: #fff; color: red" @click="cancel">取消</button>
        <button class="button" style="width: 100%" @click="changeBoard">提交</button>
      </div>
    </div>
    <button v-else class="button" @click="startEditBoard">修改公告</button>
  </div>
</template>

<script lang="ts" setup>
import api from '@/api';
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

const stationId = ref<number>();
const stationBoard = ref('');
const editBoard = ref('');
const isEditBoard = ref(false);
onLoad(() => {
  stationId.value = uni.getStorageSync('stationId');
  getStationInfo();
});

const getStationInfo = () => {
  api.getStationInfo({ stationId: stationId.value ? stationId.value : 0 }).then((res) => {
    stationBoard.value = res.data.desc;
  });
};

const startEditBoard = () => {
  editBoard.value = stationBoard.value;
  isEditBoard.value = true;
};

const changeBoard = () => {
  api.changeStationBoard(stationId.value ? stationId.value : 0, editBoard.value).then(() => {
    uni.showToast({
      title: '修改成功',
      icon: 'success',
    });
    getStationInfo();
    isEditBoard.value = false;
  });
};

const cancel = () => {
  isEditBoard.value = false;
};

const showNote = () => {
  uni.showModal({ title: '阿姨的温馨提示', showCancel: false, content: stationBoard.value });
};
</script>

<style scoped>
.ctn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100vw;
  padding-top: 16px;
}
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0052d9;
  align-self: stretch;
  margin: 16px;
  flex-direction: column;
  color: #fff;
  border-radius: 2px;
  font-size: 16px;
  padding: 0;
}
.notifications {
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 20rpx;
  margin-left: 26rpx;
  margin-right: 26rpx;
  display: flex;
  flex-direction: column;
  align-items: st;
}
.announcement {
  display: flex;
  height: 162px;
  width: auto;
  margin: 12px;
  /* background-color: pink; */
}

.textRule {
  position: relative;
  height: 100%;
  width: 70%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.announcementTitle {
  display: inline-block;
  margin: 12px;
  margin-bottom: 5px;
  font-weight: 700;
}

.textContentHidden {
  /* display: inline-block; */
  margin: 0 12px 18px 12px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 6; /*内容限制的行数 需要几行写几就行*/
  -webkit-box-orient: vertical;
}

.input {
  background-color: #fff;
  padding: 8px;
  width: auto;
  margin: 16px;
}

.edit-button {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
