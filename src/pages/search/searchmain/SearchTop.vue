<template>
  <view class="searchTop">
    <view class="navigatorBG"></view>
    <view class="topZheZhao"></view>
    <view style="height: 44px"></view>
    <view class="headNavigator">
      <view class="header" @click="back">
        <image class="backIcon" src="/static/left-arrow.svg" alt="" />
        <text>{{ name }}</text>
      </view>
      <view class="position">
        <image class="positionIcon" src="/static/weizhi_white.svg" alt="" />
        <text class="textPosition">{{ distance }}</text>
      </view>
    </view>
    <view style="height: 44px"></view>
    <view class="announcement">
      <!-- TODO: 添加图片占位符 -->
      <image src="/static/station-pic.jpg" mode="scaleToFill" style="width: 30%; height: 162px" />
      <view class="textRule">
        <view class="announcementTitle">阿姨的温馨提示</view>
        <text class="textContentHidden" @click="showNote"> {{ desc }}</text>
        <view v-if="0" class="watchMore">
          <text style="font-size: 10px">更多</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const prop = defineProps({
  name: String,
  distance: String,
  desc: String,
});

const back = () => {
  uni.navigateBack();
};

const showNote = () => {
  uni.showModal({ title: '阿姨的温馨提示', showCancel: false, content: prop.desc });
};
</script>

<style scoped>
.navigatorBG {
  position: absolute;
  z-index: -999;
  top: 0;
  width: 100%;
  height: 234px;
  background-color: #242424;
}

.topZheZhao {
  width: 100%;
  position: fixed;
  height: 44px;

  z-index: 999;
  background-color: #242424;
}

.headNavigator {
  position: fixed;
  background-color: #242424;
  width: 100%;
  height: 44px;
  padding-left: 16px;
  color: #fff;
  z-index: 999;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3px;
}

.backIcon {
  height: 20px;
  width: 20px;
}

.position {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3px;
  margin-top: 3px;
}

.textPosition {
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
}

.positionIcon {
  width: 14px;
  height: 14px;
}

.announcement {
  display: flex;
  height: 162px;
  width: auto;
  padding: 0 15px;
  margin: 19px auto 0;
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
</style>
