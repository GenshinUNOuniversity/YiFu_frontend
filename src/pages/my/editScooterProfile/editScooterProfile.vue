<template>
  <div class="scooter-area" v-if="!haveScooter">
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ScooterProfileVO } from '@/api/scooter';
import { onShow } from '@dcloudio/uni-app';

const scooterProfile = ref<ScooterProfileVO>();
const haveScooter = ref(false);

onShow (() => {
  scooterProfile.value = uni.getStorageSync('scooter');
  if (scooterProfile.value?.name != undefined && scooterProfile.value.name != '') {
    haveScooter.value = true;
  }
  
})
</script>