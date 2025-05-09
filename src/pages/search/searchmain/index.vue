<template>
  <SearchTop :name="name" :distance="distance" :desc="stationInfo?.desc"></SearchTop>
  <SearchList :pile-groups="pileGroups" :free="stationInfo?.stat?.free" :soon="stationInfo?.stat?.soon"></SearchList>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SearchTop from './SearchTop.vue';
import SearchList from './SearchList.vue';
import { onLoad } from '@dcloudio/uni-app';
import api from '@/api';
import { PileGroupVO, StationDetailVO } from '@/api/station';

const stationId = ref(0);
const stationInfo = ref<StationDetailVO>();
const pileGroups = ref<PileGroupVO[]>([]);
const name = ref('');
const distance = ref('');
onLoad((options) => {
  stationId.value = parseInt(options.id ?? '0', 10);
  name.value = options.name ?? '';
  distance.value = options.distance ?? '距离 —— 千米';
  if (stationId.value !== 0) {
    api
      .getStationInfo({
        stationId: stationId.value,
      })
      .then((res) => {
        stationInfo.value = res.data;
        pileGroups.value = res.data.pileGroupList.map((pileGroup) => {
          return {
            ...pileGroup,
            pileList: pileGroup.pileList.map((p) => {
              return {
                ...p,
                end: p.end ? new Date(p.end) : undefined,
              };
            }),
          };
        });
      });
  }
});
</script>

<style>
page {
  background-color: #f3f3f3;
}
</style>
