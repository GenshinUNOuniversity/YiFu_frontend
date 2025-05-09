<template>
  <view class="searchListTop">
    <view style="font-weight: 700">充电桩</view>
    <view class="textFreeNumber">
      <text style="color: #067945">{{ free }}</text>
      <text style="padding-left: 3px; font-size: 10px">空闲</text>
      <text style="padding-left: 14px; color: #85dbbe">{{ soon }}</text>
      <text style="padding-left: 3px; font-size: 10px">即将空闲</text>
    </view>
  </view>

  <view v-for="(pileGroup, index) in pileGroups" :key="index" class="search">
    <view class="searchTitle">
      <view class="searchTitleLeft">
        <text
          style="
            display: inline-block;
            margin: 8px 0 0 8px;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          "
          >{{ pileGroup.name }}</text
        >
      </view>
      <view class="searchTitleRight">
        <!-- <image src="../../../static/wanqulujing.png" mode="scaleToFill" /> -->
      </view>
    </view>
    <view class="searchList">
      <view v-for="(pile, index) in pileGroup.pileList" :key="index" class="searchItem">
        <text class="textId" style="font-weight: 700">{{ pile.name }}</text>
        <!-- 充好了 -->
        <view
          v-if="pile.status === Status.Free || pile.status === Status.Ended"
          class="stateIcon"
          style="background-color: #056334"
        ></view>
        <!-- 正要充 -->
        <view
          v-if="pile.status === Status.Using && !pile.isSoonFree"
          class="stateIcon"
          style="background-color: #b11f26"
        ></view>
        <!-- 快要充好了 -->
        <view v-if="pile.isSoonFree" class="stateIcon" style="background-color: #48c79c"></view>
        <text v-if="pile.status === Status.Using" class="textChargedTime" style="font-size: 12px"
          >预计{{ timeFormatter(pile.end!) }} 结束</text
        >
        <text class="textUserId" style="font-size: 12px">{{ pile.scooterCode }}</text>
        <text
          v-if="pile.scooterCode && (pile.status === Status.Ended || pile.status === Status.Free)"
          class="textUserId"
          style="font-size: 12px"
          >使用完毕</text
        >
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { PileGroupVO, Status } from '@/api/station';
import { PropType } from 'vue';
import { timeFormatter } from '@/utils/timeformatter';

defineProps({
  pileGroups: Array as PropType<PileGroupVO[]>,
  free: Number,
  soon: Number,
});
</script>

<style scoped>
.searchListTop {
  width: auto;
  padding: 0 15px;
  margin: 23px auto 0;
}
.textFreeNumber {
  display: inline-block;
  margin-top: 5px;
}

.search {
  /* height: 156px; */

  width: auto;
  padding: 0 15px;
  margin: 18px auto 0;
  /* background-color: #fff; */
  /* border-top-left-radius: 20px; */
}

.searchTitle {
  display: flex;
}

.searchTitleLeft {
  font-size: 12px;
  color: #3d3d3d;
  width: 111px;
  height: 31.5px;
  background-color: #fff;
  border-top-right-radius: 20px;
  border-bottom-right-radius: -8px;
}

.searchTitleRight {
  height: 31.5px;
  width: 235px;
  border-bottom-left-radius: 7px;
  background-color: #f3f3f3;
  z-index: 1;
  position: absolute;
  left: 130px;
}

.searchList {
  /* height: 124.5px; */
  box-sizing: border-box;
  width: 100%;
  padding: 18rpx;
  background-color: #fff;
  display: grid;
  grid-template-columns: 0fr 0fr 0fr 0fr 0fr 0fr 0fr;
}

.searchItem {
  width: 115rpx;
  /* background-color: pink; */
  display: flex;
  flex-direction: column;
}

.stateIcon {
  width: 120rpx;
  height: 7px;
}
</style>
