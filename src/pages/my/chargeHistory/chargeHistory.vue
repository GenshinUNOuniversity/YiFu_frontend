<template>
  <div >
    <div class="header">
      <div class="title">挪车</div>
      <div class="title">充电</div>
      <div class="title">被挪车</div>
    </div>
    <div v-for="item in history" :key="item.record_id">
      <div class="detail" @click="showDetail=item.record_id;">
        <div class="column">
          <image :src="item.start_image" style="height: 28vmin; width: 28vmin;" />
          <span v-if="showDetail==item.record_id">充电前挪了{{ item.start_vehicle_code }}。</span>
          <span v-if="showDetail==item.record_id">备注“{{ item.start_note }}”。</span>
          <span v-if="showDetail==item.record_id">{{ item.start_time }}</span>
          <div class="button" @click="contact1">联系车主</div>
        </div>
        <div class="column">
          <image :src="item.charging_image" style="height: 20vmin; width: 20vmin;" />
          <span v-if="showDetail==item.record_id">{{ item.station_name }} {{ item.pile_name }}</span>
          <span v-if="showDetail==item.record_id">使用时长：{{  }}</span>
          <div class="button" @click="contact2">联系管理员</div>
        </div>
        <div class="column">
          <image :src="item.end_image" style="height: 20vmin; width: 20vmin;" />
          <span v-if="showDetail==item.record_id">充电后被{{ item.end_vehicle_code }}车主挪出。</span>
          <span v-if="showDetail==item.record_id">备注“{{ item.end_note }}”</span>
          <span v-if="showDetail==item.record_id">{{ item.end_time }}</span>
          <div class="button" @click="contact3">联系挪车人</div>
        </div>
        <span v-if="showDetail!=item.record_id">{{ item.station_name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import api from '@/api';
import { ChargeHistoryVO } from '@/api/chargehistory';

const history = ref<ChargeHistoryVO[]>([
  {
    start_image: '../../../static/avatar.png',
    start_note: '无',
    start_time: '2024.1',
    record_id: '1',
    station_name: '8厕',
    pile_name: '第5间',
    end_image: '../../../static/avatar.png',
    end_note: '无',
    end_time: '2024.2',
    charging_image: '../../../static/avatar.png',
    start_vehicle_code: '?',
    end_vehicle_code: '!',
    credit_status: false,
    credit_score: 0
  }
]);
const showDetail = ref<string>('');

onLoad(() => {
  // api.getChargeHistory(uni.getStorageSync<number>('userid')).then((res) => {
  //   uni.setStorageSync('chargehistory', res.data);
  //   history.value = res.data;
  // }).catch(() => {
  //   history.value = uni.getStorageSync<ChargeHistoryVO[]>('chargehistory');
  // });
});

const contact1 = () => {

}
</script>

<style lang="less" scoped>
.header {
  margin-left: 5vw;
  margin-right: 5vw;
  margin-top: 20px;
  border-bottom: gray 2px solid;
  display: flex;
}

.title {
  width: 30vw;
  font-size: 1.2rem;
  font-weight: bold;
  color: green;
  text-align: center;
}

.detail {
  margin-left: 5vw;
  margin-right: 5vw;
  border: 2px solid gray;
  border-radius: 10px;
  display: flex;
}

.column {
  width: 30vw;
  display: flex;
  flex-direction: column;

}
</style>