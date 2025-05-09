<template>
  <map :longitude="long" :latitude="lati" scale="15" style="height: 80vh; width: 100vw;"
  show-location="true" :style="{height:'100vh', width:'100vw'}"
  :markers="marker" @regionchange="ch" @markertap="tap" @callouttap="tap">
    <div v-if="showDetail" style="height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center;" @click="showDetail = false;">
      <div v-if="showDetail" class="detail">
        <span style="font-size: 1.2rem; font-weight: bold; border-top: 20px;">{{ marker[id].callout.content }}</span>
        <span>当前空闲：10</span>
        <div v-if="!inQueue" style="display: flex; gap:30vw;">
          <div v-if="(10 > 0)" class="gotoUse" @click="f1(id.toString())">去使用</div>
          <div v-else class="gotoQueue" @click="f2(id.toString())">加入排队</div>
        </div>
      </div>
    </div>
    <div class="getlocation" @click="getlocation">获取定位</div>
  </map>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';

const long = ref<number>(114.36472946844697);
const lati = ref<number>(30.535724219562233);
const showDetail = ref<boolean>(false);
const id = ref<number>(0);
const inQueue = ref<boolean>(false);

const marker = [
  {
    id: 0,
    latitude: 30.526346,
    longitude: 114.358796,
    iconPath: '../../static/map-pin.svg',
    width: 20,
    height: 20,
    callout: {
      content: '信息学部充电站',
      display: 'ALWAYS',
      anchorX: 0,
      anchorY: 0,
      color: '#000000',
      fontSize: 24,
      borderRadius: 0,
      borderWidth: 0,
      bgColor: '#ffffff',
      padding: 0,
      textAlign: 'center'
    }
  }
]

const f1 = (id: string) => {
  console.log('gotoUse1');
  uni.showToast({
    icon: 'success',
    title: '使用成功',
    duration: 500
  });
  uni.navigateTo({ url: `./stationDetail/stationDetail?stationId=${id}` });
}

const f2 = (id: string) => {
  console.log('gotoRate');
  uni.navigateTo({ url: `./stationDetail/stationDetail?stationId=${id}` });
}

const getLocationAu = () => {
  return new Promise<void>((resolve, reject) => {
    uni.authorize({
      scope: 'scope.userLocation',
      success: (res) => {
        console.log(res);
        resolve();
      },
      fail: (err) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        console.log(err);
        reject(err);
      },
    });
  });
};

onShow(() => {
  console.log('map:onshow');
  getLocationAu().then(() => {
    uni.showToast({
      icon: 'success',
      title: 'getlocation'
    });
  });
});

const ch = (res) => {
  // console.log(res.detail);
};

const tap = (res) => {
  console.log(res.detail.markerId);
  id.value = res.detail.markerId;
  showDetail.value = true;
};

const getlocation = () => {
  uni.getLocation().then((res) => {
    long.value = res.longitude+0.0001;
    lati.value = res.latitude+0.0001;
    long.value = res.longitude;
    lati.value = res.latitude;
    console.log(res);
  });
};
</script>

<style lang="less" scoped>
.getlocation {
  position: absolute;
  height: 30px;
  padding-left: 5px;
  padding-right: 5px;
  background-color: white;
  bottom: 3px;
  right: 3px;
}

.detail {
  background-color: white;
  border-radius: 10px;
  width: 65vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gotoUse {
  margin-top: 15px;
  margin-bottom: 15px;
  padding-left: 5px;
  padding-right: 5px;
  border: 1px black solid;
  background-color: white;
  color: black;
}

// .gotoUse-inavailable {
//   margin-top: 15px;
//   margin-bottom: 15px;
//   padding-left: 5px;
//   padding-right: 5px;
//   border: 1px black solid;
//   background-color: gray;
//   color: white;
// }

.gotoQueue {
  margin-top: 15px;
  margin-bottom: 15px;
  padding-left: 5px;
  padding-right: 5px;
  border: 1px black solid;
  background-color: white;
  color: black;
}
</style>