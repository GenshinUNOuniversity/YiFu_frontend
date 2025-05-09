<template>
  <div class="icon">
    <div class="icon">
      <image class="charge-station" src="../../../static/charge-station.svg" />
      <div class="combine">
        <image class="CombinedShape" src="../../../static/CombinedShape.svg" />
        <image class="Oval" src="../../../static/Oval.svg" />
      </div>
    </div>
  </div>

  <div class="title">已允许充电</div>
  <div class="content">预计{{ time }}结束</div>
</template>

<script lang="ts">
export default {
  name: 'StartCharging',
  components: {},
  props: {},
  data() {
    return {
      time: '22:30',
    };
  },
  computed: {},
  watch: {},
  methods: {},
};
</script>

<style scoped>
.icon {
  display: flex;
  margin: auto;
  margin-top: 200rpx;
  padding-left: 60rpx;
  padding-bottom: 15rpx;
}

.charge-station {
  width: 82.25px;
  height: 70.5px;

  z-index: 0;
}
.Oval {
  width: 40.83px;
  height: 40.83px;
  left: -40px;
  top: 40px;
  z-index: 1;
}
.CombinedShape {
  width: 21.41px;
  height: 14.91px;
  left: -8px;
  top: 27px;
  z-index: 2;
}

.title {
  margin: auto;

  left: 127px;
  top: 389px;
  width: 120px;
  height: 35px;
  font-family: SourceHanSansCN-Bold;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 0px;
  color: #07c160;
}
.content {
  margin: auto;
  font-family: SourceHanSansCN-Regular;
  font-size: 12px;
  font-weight: normal;
  text-align: center;
  letter-spacing: 0px;

  /* 正文色/正文色 */
  color: #1a1a1a;
}
</style>
