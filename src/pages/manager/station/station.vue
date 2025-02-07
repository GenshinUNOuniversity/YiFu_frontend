<template>
  <div v-for="(pileStation, index) in stationInfo?.pileGroupList" :key="index">
    <uni-section
      :title="pileStation.name"
      type="line"
      title-font-size="24px"
      @click="pileStation.isShow = !pileStation.isShow"
    >
      <template #right>
        <uni-icons v-if="!pileStation.isShow" type="forward" size="24" />
        <uni-icons v-else type="bottom" size="24" />
      </template>
      <uni-list v-if="pileStation.isShow">
        <uni-list-item
          v-for="(pile, index) in pileStation.pileList"
          :key="index"
          :thumb="thumbPicFormatter(pile.status, pile.isSoonFree)"
          thumb-size="base"
          show-arrow
          clickable
          @click="handleClick(pile.pileId)"
          ><template #body>
            <div class="pile-upper">
              <div class="pile-name">{{ pile.name }}</div>
              <div v-if="pile.scooterCode" class="pile-user">
                {{ pile.scooterCode }} {{ pile.status === Status.Using ? '正在使用' : '使用结束' }}
              </div>
              <div v-else>{{ pileStatusFormatter(pile) }}</div>
            </div>
            <div class="pile-lower">
              <text v-if="pile.begin">开始时间：{{ timeFormatter(pile.begin) }} </text>
              <text v-if="pile.end">
                {{ pile.status === Status.Using ? '预计结束' : '结束' }}时间：{{ timeFormatter(pile.end) }}
              </text>
            </div>
          </template>
        </uni-list-item>
      </uni-list></uni-section
    >
  </div>
</template>

<script lang="ts" setup>
import api from '@/api';
import { PileBriefVO, StationDetailVO, Status } from '@/api/station';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { timeFormatter } from '@/utils/timeformatter';

const stationInfo = ref<StationDetailVO>();

const stationId = ref<number>();

const pileStatusFormatter = (pile: PileBriefVO) => {
  if (pile.isSoonFree) {
    return '即将充满';
  }
  switch (pile.status) {
    case Status.Repairing:
      return '正在维修';
    case Status.Using:
      return '正在使用';
    case Status.Free:
      return '空闲';
    case Status.Ended:
      return '空闲';
    default:
      break;
  }
};

const handleClick = (pileId: number) => {
  uni.navigateTo({
    url: `./pileDetail/pileDetail?pileId=${pileId}`,
    //url:'./pileDetail/pileDetail'
  });
};

onShow(async () => {
  try {
    stationId.value = uni.getStorageSync('stationId');
    stationInfo.value = (await api.getStationInfo({ stationId: stationId.value! })).data;
    stationInfo.value = {
      ...stationInfo.value,
      pileGroupList: stationInfo.value.pileGroupList.map((pileGroup) => ({
        ...pileGroup,
        isShow: true,
        pileList: pileGroup.pileList.map((pile) => ({
          ...pile,
          begin: pile.begin ? new Date(pile.begin) : undefined,
          end: pile.end ? new Date(pile.end) : undefined,
        })),
      })),
    };
    uni.setNavigationBarTitle({
      title: stationInfo.value.name,
    });
    console.log(stationInfo.value);
  } catch (error) {
    console.log(error);
  }
});

// 列表右侧图片
const thumbPicFormatter = (status: Status, isSoonFree?: boolean) => {
  if (isSoonFree) return '/static/chargingstationSoonFree.svg';
  switch (status) {
    case Status.Repairing:
      return '/static/chargingstation.svg';
    case Status.Using:
      return '/static/chargingstationUse.svg';
    case Status.Free:
      return '/static/chargingstationGreen.svg';
    case Status.Ended:
      return '/static/chargingstationGreen.svg';

    default:
      break;
  }
};
</script>

<style scoped>
.contain-box {
  background-color: rgba(230, 230, 230);
  box-shadow: 0px 5px 20px 0px rgba(161, 161, 161);
  padding: 32rpx;
  width: 92%;
  border-radius: 30rpx;
}

.title {
  text-align: center;
  font-size: 50rpx;
  margin-top: 60rpx;
  margin-bottom: 50rpx;
}

.subtitle {
  font-size: 40rpx;
  padding-bottom: 16px;
}

.pile-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px;
  padding: 8px;
  background-color: #fff;
  border-radius: 16px;
}
.pile {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-basis: 20%;
  margin-bottom: 8px;
  padding: 4px;
  border-radius: 16px;
  border: solid 1px;
  border-width: 2px;
  background-color: #efefef;
  box-shadow: 0px 0px 15px -5px rgba(161, 161, 161);
}
</style>

<style scoped>
.pile-upper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 16px;
}

.pile-lower {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  font-size: 12px;
}
</style>
