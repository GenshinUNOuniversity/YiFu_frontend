<!-- eslint-disable max-nested-callbacks -->
<template>
  <div>
    <map
      v-if="isComplete"
      class="map"
      :latitude="latitude"
      :longitude="longitude"
      :polygons="polygons"
      :markers="markers"
      @markertap="onClickMarker"
    ></map>

    <!-- 我感觉这里加个动画比较好 -->
    <!-- 我要思考一下 怎么显示不同充电站的？传参？ -->
    <!-- <navigator hover-class="none" @click="back"> -->
    <!-- 咋设置点击态效果 -->
    <view v-for="(station, index) in stationList" :key="index" class="mapList" @click="onClickStation(station)">
      <view class="mapListLeft">
        <text class="scooterName">{{ station.name }}</text>
        <text class="textTotalNumber">共{{ station.stat?.total }}个充电桩</text>
        <view class="textFreeNumber">
          <text style="color: #067945">{{ station.stat?.free }} </text>
          <text style="padding-left: 3px; font-size: 10px">已空闲</text>
          <text style="padding-left: 14px; color: #85dbbe">{{ station.stat?.soon }} </text>
          <text style="padding-left: 3px; font-size: 10px">即将空闲</text>
        </view>
        <view class="position">
          <image class="positionIcon" src="/static/weizhi.svg" alt="" />
          <text class="textPosition">{{ station.locationDesc }}</text>
        </view>
      </view>

      <view class="mapListRight">
        <view class="textChoose">选择</view>
        <view class="textDistance">{{ distanceFormatter(station.distance) }}</view>
      </view>
    </view>
    <view style="height: 8px"></view>
    <bottom-loading-prompt :has-more="false" />
  </div>
</template>

<script lang="ts" setup>
import api from '@/api';
import { StationBriefVO } from '@/api/station';
import { getDistance, distanceFormatter } from '@/utils/location';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { MapMarker, MapPolygon } from 'uni-app-types';
import { ref } from 'vue';
import BottomLoadingPrompt from '../components/bottomLoadingPrompt/bottomLoadingPrompt.vue';
import { UserScooterStatus, getUserScooterStatus } from '@/utils/status';

const isComplete = ref(false);
const latitude = ref(0);
const longitude = ref(0);
// 获取用户定位
const polygons = ref<MapPolygon[]>([]);
const markers = ref<MapMarker[]>([]);

const arrange = (arr: number[]) => {
  let total = 0;
  arr.forEach((item) => {
    total = item + total;
  });
  console.log(total / arr.length);
  return total / arr.length;
};
const stationList = ref<(StationBriefVO & { distance: number })[]>([]);
const isActive = ref(false);
const isNeedUpdateProfile = ref<boolean>(uni.getStorageSync('needUpdateProfile'));
const scooterStatus = ref<UserScooterStatus>(UserScooterStatus.None);
onShow(async () => {
  if (uni.getStorageSync('status') === 'None') {
    isActive.value = false;
  } else {
    isActive.value = true;
  }
  isNeedUpdateProfile.value = uni.getStorageSync('needUpdateProfile');
  scooterStatus.value = await getUserScooterStatus();
  isComplete.value = false;
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      latitude.value = res.latitude;
      longitude.value = res.longitude;
      if (
        markers.value.some((marker) => {
          return marker.id === 999999999;
        })
      ) {
        markers.value.map((marker) => {
          if (marker.id === 999999999) {
            marker.latitude = latitude.value;
            marker.longitude = longitude.value;
            return marker;
          } else {
            return marker;
          }
        });
      } else {
        markers.value.push({
          id: 999999999,
          latitude: latitude.value,
          longitude: longitude.value,
          width: 32,
          height: 32,
          iconPath: '/static/diandongche.png',
        });
      }
      console.log(markers.value);
    },
    fail: (err) => {
      console.log(err);
    },
  });
  api.getAllStationInfo().then((res) => {
    stationList.value = res.data.stations
      .map((station) => ({
        ...station,
        distance: Math.min(
          // eslint-disable-next-line max-nested-callbacks
          ...station.location.map((location) => {
            return getDistance(latitude.value, longitude.value, Number(location.latitude), Number(location.longitude));
          }),
        ),
      }))
      .sort((station1, station2) => {
        return station1.distance - station2.distance;
      });
    polygons.value = res.data.stations.map((station) => ({
      points: station.location,
      strokeWidth: 2,
      strokeColor: '#000000',
      fillColor: '#E85562',
      zIndex: 1,
      level: 'abovelabels',
    }));
    markers.value = res.data.stations
      .map((station) => ({
        id: station.stationId,
        latitude: arrange(
          station.location.map((location) => {
            return location.latitude;
          }),
        ),
        longitude: arrange(
          station.location.map((location) => {
            return location.longitude;
          }),
        ),
        iconPath: '',
        callout: {
          content: station.name,
          color: '#000',
          fontSize: 16,
          borderRadius: 12,
          display: 'ALWAYS',
          padding: 4,
        },
      }))
      .concat(markers.value);
    isComplete.value = true;
  });
});

const onClickMarker = (event: { detail: { markerId: number } }) => {
  const station = stationList.value.filter((station) => {
    return station.stationId === event.detail.markerId;
  })[0];
  uni.navigateTo({
    url: `/pages/search/searchmain/index?id=${station.stationId}&name=${station.name}&distance=${distanceFormatter(
      station.distance,
    )}`,
  });
};

const onClickStation = (station: StationBriefVO & { distance: number }) => {
  if (!isActive.value) {
    uni.showModal({
      title: '错误',
      content: '您还未激活\n，请添加电动车后找站管激活。',
      showCancel: false,
    });
    return;
  } else if (isNeedUpdateProfile.value) {
    uni.showModal({
      title: '错误',
      content: '您还未完善个人信息，是否前往完善？',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/components/userProfile/userProfile',
          });
        }
      },
    });
    return;
  } else if (scooterStatus.value !== UserScooterStatus.Normal) {
    uni.showModal({
      title: '错误',
      content:
        scooterStatus.value === UserScooterStatus.None
          ? '您还没有绑定电动车，请绑定电动车。'
          : '您的电动车暂未激活，请先找站管进行激活。',
      showCancel: false,
    });
    return;
  }
  uni.navigateTo({
    url: `/pages/search/searchmain/index?id=${station.stationId}&name=${station.name}&distance=${distanceFormatter(
      station.distance,
    )}`,
  });
};
</script>
<style>
page {
  background-color: #f3f3f3;
}
</style>
<style scoped>
.map {
  width: 100%;
  height: 200px;
  margin-bottom: 11px;
}

.mapList {
  position: relative;
  display: flex;
  margin: 0 11px 19px;
  background-color: #fff;
}

.mapListLeft {
  display: flex;
  flex-direction: column;
  width: 75%;
  height: 100%;
  padding: 11px 0 11px 14px;
  /* background-color: pink; */
}

.mapListRight {
  width: 25%;
  /* background-color: skyblue; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.scooterName {
  color: #3d3d3d;
  font-weight: 700;
}

.textTotalNumber {
  font-size: 12px;
  color: #767676;
  display: inline-block;
  margin-top: 5px;
  /* padding-left: 14px; */
}
.textFreeNumber {
  display: inline-block;
  margin-top: 7px;
}

.position {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

.textPosition {
  color: rgba(0, 0, 0, 0.4);
  font-size: 10px;
}

.positionIcon {
  height: 12px;
  width: 12px;
}

.textChoose {
  display: inline-block;
  font-size: 12px;
}

.textDistance {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.4);
}
</style>
