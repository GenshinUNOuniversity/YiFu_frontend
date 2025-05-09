<template>
  <div class="ctn">
    <div></div>
    <div>
      <div class="pic">
        <image src="/static/reportsuccess.svg" mode="aspectFit" class="pic1" />
        <image src="/static/done.svg" mode="aspectFit" class="pic2" />
      </div>
      <p class="report">已举报</p>
      <p class="where">已反馈至{{ stationName }}管理员</p>
    </div>
    <div class="return" @click="returnTo">返回</div>
  </div>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

const stationName = ref('');

const returnTo = () => {
  uni.navigateBack({ delta: 2 });
};
onLoad((options) => {
  stationName.value = options.stationName!;
  console.log(options);
});
</script>
<style scoped lang="less">
@import (less) '@/common/font.css';

.ctn {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.pic {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}
.pic1 {
  width: 65.88px;
  height: 76.67px;
}
.pic2 {
  width: 40.83px;
  margin-bottom: -13.17px;
  margin-left: -26.06px;
  height: 40.83px;
}
.report {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 0px;
  color: #0052d9;
}
.where {
  font-size: 12px;
  font-weight: normal;
  text-align: center;
  letter-spacing: 0px;
  color: #1a1a1a;
}
.return {
  border-radius: 4px;
  align-self: stretch;
  margin: 16px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box; /* 功能色/品牌色/Brand8-Normal */
  border: 1px solid #0052d9;
  color: #0052d9;
  padding: 16px;
}
</style>
