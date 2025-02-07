<template>
  <div class="divider" :style="{ width, height }" />
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';

const props = defineProps({
  height: {
    type: String,
    default: '1px',
  },
  width: {
    type: String,
    default: '1px',
  },
});
const { width, height } = toRefs(props);
</script>

<style scoped>
.divider {
  background: #d8d8d8;
}
</style>
