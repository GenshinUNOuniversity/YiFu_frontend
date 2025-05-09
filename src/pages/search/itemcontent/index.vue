<template>
  <view class="itemcontent">
    <image src="/static/back.svg" class="backIcon" @click="back" />
    <view class="textTitle" style="font-size: 30px">桂园充电站</view>
    <view class="textTitle" style="font-size: 20px">1-01充电桩</view>
    <view v-if="0">
      <view class="State">
        <view class="freeIcon"></view>
        <text class="freeText">空闲</text>
      </view>

      <view class="centerText">B001号充满已取车</view>

      <view class="description">
        <image class="question" src="/static/wenhao.svg" alt="" />
        <view style="font-size: 12px; padding: 0 10px 0 30px; height: 60px"
          >· 若充电桩处有其他电动车正在充电，或存在其他异常情况，请现场寻找站管处理或点击举报
        </view>
      </view>
    </view>

    <view v-if="1">
      <view class="State">
        <view class="busyIcon"></view>
        <text class="busyText">使用中</text>
      </view>

      <view class="centerText">
        <text>B001号</text>
        <text style="font-weight: 400">电动车正在充电</text>
      </view>
      <view class="centerText">
        <text>已充电</text>
        <text style="color: rgb(129, 179, 55)"> 6小时17分钟</text>
      </view>
      <view class="centerText">
        <text>预计剩余</text>
        <text style="color: rgb(189, 49, 36)"> 1小时43分钟</text>
      </view>

      <view class="centerText">
        <text style="font-size: 18px">充满标志</text>
        <text style="color: rgb(129, 179, 55); font-size: 18px"> 充电器亮绿灯</text>
      </view>

      <view class="description">
        <image class="question" src="/static/wenhao.svg" alt="" />
        <view style="font-size: 12px; padding: 0 10px 0 30px"
          >· 若正在充电的电动车编号与上述不符，或存在其他异常情况，请现场寻找站管处理或者点击举报
        </view>
        <view style="font-size: 12px; padding: 0 10px 0 30px">· 若您判断该电动车已充满，请点击扫码充电 </view>
      </view>
    </view>

    <button class="btn" type="default" style="color: rgb(190, 54, 42); bottom: 60px">举报</button>
    <button class="btn" type="default" style="color: rgb(129, 179, 55); bottom: 5px">扫码充电</button>
  </view>
</template>

<script>
export default {
  name: 'Itemcontent',
  components: {},
  setup() {
    const back = function () {
      uni.switchTab({
        url: '../index',
      });
    };
    return { back };
  },
};
</script>

<style scoped>
.btn {
  position: absolute;
  transform: translateX(-75px);
  left: 50%;
  width: 150px;
  font-size: 20px;
  font-weight: 900;
}
.itemcontent {
  position: relative;
  margin: 50px auto;
  height: 500px;
  width: 80%;
  border: 1px solid rgb(198, 198, 198);
  border-radius: 20px;
}

.backIcon {
  position: absolute;
  width: 40px;
  height: 40px;
  left: 10px;
  top: 10px;
}

.textTitle {
  margin: 10px;
  text-align: center;

  font-weight: 900;
}

.freeIcon {
  position: absolute;
  left: 50%;
  transform: translateX(-60px);
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: rgb(129, 179, 55);
}

.freeText {
  position: absolute;
  left: 50%;
  transform: translate(-10px, 5px);

  font-size: 20px;
  color: rgb(129, 179, 55);
  font-size: 18px;
  font-weight: 900;
}

.State {
  position: relative;
  margin: 20px auto;
  height: 50px;
  display: flex;
}

.centerText {
  font-weight: 900;
  text-align: center;
  margin-bottom: 10px;
}
.description {
  position: absolute;
  bottom: 120px;
}
.question {
  position: absolute;
  height: 20px;
  width: 20px;
  left: 10px;
}

/* 其实可以和上面的代码合并一下 但是我先这样写吧 别骂我呜呜呜 */

.busyIcon {
  position: absolute;
  left: 50%;
  transform: translateX(-60px);
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: rgb(189, 49, 36);
}

.busyText {
  position: absolute;
  left: 50%;
  transform: translate(-15px, 5px);
  font-size: 20px;
  color: rgb(189, 49, 36);
  font-size: 18px;
  font-weight: 900;
}
</style>
