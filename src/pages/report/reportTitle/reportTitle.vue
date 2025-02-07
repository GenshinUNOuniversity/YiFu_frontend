<template>
  <div class="ctn">
    <div
      v-for="(reprtTitle, index) in reprtTitles"
      :key="index"
      class="reportTitle"
      @click="handleSelect(reprtTitle.context)"
    >
      <p>{{ reprtTitle.context }}</p>
      <image src="/static/youjiantou_black.svg" mode="scaleToFill" style="height: 16px; width: 16px" />
    </div>
    <div class="other" @click="changeEnterClass">
      <p>其他</p>
      <image
        src="/static/youjiantou_black.svg"
        mode="scaleToFill"
        style="height: 16px; width: 16px"
        :class="arrowClass"
      />
    </div>
    <div v-if="!firstOpen" :class="enterClass">
      <input v-model="otherContext" placeholder="请输入问题" :maxlength="30" class="otherText" />
      <div class="confirmCtn">
        <button class="confirm" plain hover-class="button-hover" @click="handleSelect(otherContext)">确定</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const reprtTitles = ref([
  { id: 0, context: '我的车被偷了' },
  { id: 0, context: '你的车我偷了' },
  { id: 0, context: '我的车被你偷了' },
  { id: 0, context: '你的车被我偷了' },
]);

const handleSelect = (text: string) => {
  uni.$emit('reportTitle', { reportTitle: text });
  uni.navigateBack();
};

const enterClass = ref('enterClose');
const arrowClass = ref('');
const firstOpen = ref(true);
const changeEnterClass = () => {
  if (firstOpen.value) {
    firstOpen.value = false;
  }
  if (enterClass.value === 'enterOpen') {
    enterClass.value = 'enterClose';
    arrowClass.value = 'arrowNormal';
  } else {
    enterClass.value = 'enterOpen';
    arrowClass.value = 'arrowDown';
  }
};

const otherContext = ref('');
</script>

<style scoped>
.ctn {
  margin-top: 16px;
}
@keyframes enter {
  from {
    height: 0px;
  }
  to {
    height: 73px;
  }
}
@keyframes exit {
  to {
    height: 0px;
  }
  from {
    height: 73px;
  }
}
@keyframes arrowDown {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(90deg);
  }
}
@keyframes arrowNormal {
  to {
    transform: rotate(0deg);
  }
  from {
    transform: rotate(90deg);
  }
}
.enterOpen {
  animation-name: enter;
  animation-duration: 0.5s;
  background-color: #fff;
  height: 73px;
  overflow: hidden;
  display: flex;
  width: auto;
  justify-content: space-between;
  flex-direction: column;
}
.enterClose {
  animation-name: exit;
  animation-duration: 0.5s;
  background-color: #fff;
  overflow: hidden;
  height: 0px;
  display: flex;
  width: auto;
  justify-content: space-between;
  flex-direction: column;
}
.arrowDown {
  animation-name: arrowDown;
  animation-duration: 0.5s;
  transform: rotate(90deg);
}
.arrowNormal {
  animation-name: arrowNormal;
  animation-duration: 0.5s;
  transform: rotate(0deg);
}
.reportTitle {
  padding-left: 16px;
  padding-right: 16px;
  height: 47px;
  width: auto;
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #1a1a1a;
  background: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.other {
  margin-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  height: 47px;
  width: auto;
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #1a1a1a;
  background: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.otherText {
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #9e9e9e;
  padding-left: 16px;
  padding-top: 2px;
}
.confirmCtn {
  align-self: flex-end;
  margin-right: 8px;
  margin-bottom: 10px;
}
.confirm {
  width: 58px;
  height: 26px;
  border-radius: 2px;
  border: 1px solid #dcdcdc;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
