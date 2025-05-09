<template>
  <div class="header">
    <span class="title">{{ stations[id].name }}</span>
    <span style="color: white;">{{ stations[id].address }}</span>
    <span style="color: white;">当前空闲：{{ free }}</span>
    <div style="width: 86vw;">
      <span v-if="free>0" style="color: white;">可使用</span>
      <span v-else style="color: white;">排队状态：{{ (isInQueue) ? '已排队...' : '未排队' }}</span>
      <span class="button">{{ (isInQueue) ? '加入排队' : '取消排队' }}</span>
    </div>
  </div>
  <div class="detail">
    <div v-if="myturn" style="width: 86vw; margin-top: 20px;">
      <p style="font-size: 1.2rem; color: green;">hi, 小马！</p>
      <div style="display: flex;">
        <span style="font-size: 1.2rem; color: green;">请使用</span>
        <div class="available" style="font-size: 1.2rem;">10号</div>
      </div>
      <div class="updateform">
        <div style="font-size: 1.2rem; color: gray;">第一步：挪出该桩充电车辆，上传停放位置</div>
        <div style="text-align: right;">
          <div class="button1" @click="gotoUpdate">去上传</div>
        </div>
        
        <div style="font-size: 1.2rem; color: gray;">第二步：插入充电器插头，扫描该桩二维码，即可刷校园卡开始充电</div>
        <div style="text-align: right;">
          <div class="button1" @click="gotoScan">去扫码</div>
        </div>
      </div>
    </div>
    <p class="title1">站内充电桩概况</p>
    <div style="width: 86vw; display: flex; flex-direction: row-reverse;">
      <div class="available">现在可用</div>
      <div class="lessthan5mins">5分钟内</div>
      <div class="morethan5mins">5分钟以上</div>
    </div>
    <div style="width: 86vw; display: flex; flex-direction: row-reverse; margin-bottom: 20px;">
      <div class="error">充电桩无法使用</div>
    </div>
    <div style="display: flex;">
      <div class="pilelist-left">
        <div v-for="count in halfLength" :key="count" style="width: 38vw; display: flex; flex-direction: row-reverse;">
          <div v-if="piles[count-1]==0" class="available">{{ count }}号</div>
          <div v-else-if="piles[count-1]==1" class="lessthan5mins">{{ count }}号</div>
          <div v-else-if="piles[count-1]==2" class="morethan5mins">{{ count }}号</div>
          <div v-else class="error">{{ count }}号</div>
        </div>
      </div>
      <div class="pilelist-right">
        <div v-for="count in halfLength" :key="count+halfLength" style="width: 38vw; display: flex; flex-direction: row;">
          <div v-if="piles[count-1+halfLength]==0" class="available">{{ count+halfLength }}号</div>
          <div v-else-if="piles[count-1+halfLength]==1" class="lessthan5mins">{{ count+halfLength }}号</div>
          <div v-else-if="piles[count-1+halfLength]==2" class="morethan5mins">{{ count+halfLength }}号</div>
          <div v-else class="error">{{ count+halfLength }}号</div>
        </div>
      </div>
    </div>
    <div style="width: 86vw; display: flex; justify-content: center;">
      <span style="color: green; margin-top: 20px;">联系本站管理员</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

const id = ref<number>(0);
const free = ref<number>(0);
const isInQueue = ref<boolean>(false);
const piles = ref<number[]>([1,3,1,2,1,3,0,0,2,0,2,1]);
const halfLength = ref<number>(6);
const myturn = ref<boolean>(true);

onLoad((res) => {
  console.log('id:'+res.stationId);
  id.value = res.stationId;
});

const stations = [{
  name: '信息学部充电站',
  address: '信息学部7舍楼下'
}];

const gotoUpdate = () => {
  uni.navigateTo({ url: `./updateMove?stationId=${id.value}` });
};

const gotoScan = () => {
  uni.scanCode({
    onlyFromCamera: true,
    scanType: ['qrCode'],
    success: ({ result, scanType, charSet, path }) => {
      console.log(result);
    },
    fail: (error) => {}
  })
}
</script>

<style lang="less" scoped>
.header {
  height: 25vh;
  width: 100vw;
  padding-left: 7vw;
  padding-right: 7vw;
  background-color: green;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
}

.title {
  font-size: 1.2rem;
  font-weight: bold;
  border-top: 20px;
  color: white;
}

.button {
  position: absolute;
  right: 7vw;
  padding-left: 5px;
  padding-right: 5px;
  border: 1px black solid;
  background-color: white;
  color: black;
  font-size: 1.2rem;
}

.detail {
  width: 100vw;
  padding-left: 7vw;
  padding-right: 7vw;
}

.pilelist-left {
  width: 38vw;
  padding-right: 5vw;
  display: flex;
  flex-direction: column;
  align-items: end;
}

.pilelist-right {
  width: 38vw;
  padding-left: 5vw;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.title1 {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  color: green;
}

.available {
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 3px;
  background-color: rgb(0, 121, 0);
  color: white;
}

.lessthan5mins {
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 3px;
  background-color: rgb(131, 235, 157);
  color: white;
}

.morethan5mins {
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 3px;
  background-color: rgb(112, 118, 118);
  color: white;
}

.error {
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 3px;
  background-color: rgb(250, 114, 80);
  color: white;
}

.button1 {
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
  border: 1px black solid;
  background-color: white;
  color: black;
  font-size: 1.2rem;
}

.updateform {
  border-top: 3px solid gray;
  border-bottom: 3px solid gray;
  width: 86vw;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 15px;
}
</style>