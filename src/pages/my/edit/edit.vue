<template>
  <view class="content">
    <template v-if="flag === false">
      <view class="title">添加电动车</view>
      <view class="input-content">
        <view class="input-area"></view>
        <view class="place-holder" :class="{ 'word-fadeout': focus, 'word-fadein': !focus & !firstEnter }"
          >输入编号</view
        >
        <input
          v-model="code"
          type="text"
          class="input"
          maxlength="5"
          :class="{ 'input-fadein': focus }"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </view>
      <view class="input-content-right">
        <view :class="{ 'right-fadeout': !focus, 'right-fadein': focus, go: !firstEnter }" @click="submitbond">
          <image v-show="focus === true" src="../../../static/arrow-right.svg" class="arrow-right"></image>
        </view>
      </view>
      <view class="small-title">电驴所归属站点</view>

      <view class="uni-form-item uni-column">
        <picker :range="stationList" range-key="name" @change="selectStation">
          <label class="modify">修改</label>
          <label class="charging-time"
            >{{ stationSelected ? stationList[stationSelected].name : '请选择充电站' }}
          </label>
        </picker>
      </view>

      <view class="small-title" style="top: 530rpx">电驴预期充电时间</view>

      <view class="uni-form-item uni-column">
        <picker :range="[1, 2, 3, 4, 5, 6, 7, 8]" @change="selectChargingTime">
          <label class="modify" style="top: 570rpx">修改</label>
          <label class="charging-time" style="top: 570rpx"
            >{{ chargingTime ? chargingTime + '小时' : '请选择预期充电时间' }}
          </label>
        </picker>
      </view>

      <view class="small-title" style="top: 620rpx">电驴充满电描述</view>
      <input
        v-model="completeDesc"
        class="charging-time"
        style="top: 660rpx"
        type="text"
        placeholder="请输入车辆充满电描述"
      />

      <!-- <button class="bond" @click="submitbond">绑定小电驴</button> -->
    </template>
    <template v-if="flag === true">
      <view class="main-picture">
        <view class="number">{{ code }}</view>
        <view v-if="checked" class="circle1" :class="{ 'circle-color1': checked, 'circle-color3': !checked }"></view>
        <view v-else class="circle2" :class="{ 'circle-color2': !checked, 'circle-color3': checked }"></view>
        <image v-if="checked" src="../../../static/checked.png" class="icon1"></image>
        <image v-else src="../../../static/checking.png" class="icon2"></image>
        <view v-if="checked" class="checked" :class="{ 'checked-color': checked, 'unchecked-color': !checked }"
          >已认证</view
        >
        <view v-else class="checking" :class="{ 'checking-color': !checked, 'unchecked-color': checked }">{{
          reject ? '被拒绝' : '待审核'
        }}</view>
      </view>
      <image src="../../../static/ebike.svg" class="picture"></image>
      <view class="delete-container">
        <button class="delete" @click="disbondScooter">删除电动车</button>
      </view>
    </template>
  </view>
</template>

<script lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import api from '@/api';
import { ref } from 'vue';
export default {
  name: 'Edit',
  setup() {
    onLoad((options) => {
      if (options.haveScooter === 'true') {
        flag.value = true;
        scooterId.value = Number(options.scooterId);
        code.value = options.code!;
        checked.value = Boolean(options.checked);
        console.log(checked.value);
        reject.value = options.reject!;
      } else {
        uni.showLoading({ title: '加载中' });
        flag.value = false;
        api.getAllStationInfo().then((res) => {
          uni.hideLoading();
          stationList.value = res.data.stations.map((station) => {
            return { name: station.name, stationId: station.stationId };
          });
        });
      }
    });

    const codeRegular = /^[A-Z]?\d{1,4}$/;

    const stationList = ref<{ stationId: number; name: string }[]>([]);
    const stationSelected = ref<number>();
    const selectStation = (e) => {
      stationSelected.value = e.target.value;
    };

    const flag = ref<boolean>();
    const firstEnter = ref(true);
    const focus = ref(false);
    const code = ref('');
    const chargingTime = ref<number>();
    const checked = ref(false);
    const reject = ref(false);
    const completeDesc = ref('');
    const scooterId = ref<number>();

    const selectChargingTime = (e) => {
      chargingTime.value = Number(e.target.value) + 1;
    };

    const handleFocus = () => {
      focus.value = true;
      firstEnter.value = false;
    };

    const handleBlur = () => {
      if (code.value === '') {
        focus.value = false;
      }
    };

    const submitbond = () => {
      if (!code.value) {
        uni.showToast({ title: '请输入编号', icon: 'error' });
        return;
      } else if (!stationSelected.value) {
        uni.showToast({ title: '请选择充电站', icon: 'error' });
        return;
      } else if (!chargingTime.value) {
        uni.showToast({ title: '请选择充电时间', icon: 'error' });
        return;
      } else if (!completeDesc.value) {
        uni.showToast({ title: '请填写充满描述', icon: 'error' });
        return;
      } else if (!codeRegular.test(code.value)) {
        uni.showToast({ title: '请输入正确编号', icon: 'error' });
        return;
      } else {
        uni.showModal({
          title: '绑定电动车',
          content: `编号：${code.value}\r\n所属充电站：${
            stationList.value[stationSelected.value].name
          }\r\n预计充电时间${chargingTime.value}小时\r\n充电结束描述：${completeDesc.value}`,
          confirmText: '绑定',
          success: (res) => {
            if (res.confirm) {
              api
                .bondScooter(
                  { completeDesc: completeDesc.value, expectHour: chargingTime.value! },
                  code.value,
                  stationList.value[stationSelected.value!].stationId,
                )
                .then(() => {
                  uni.showToast({ title: '绑定成功', icon: 'success' });
                  uni.navigateBack();
                })
                .catch((err) => {
                  uni.showToast({ title: err.message, icon: 'none' });
                });
            }
          },
        });
      }
    };
    const disbondScooter = () => {
      uni.showModal({
        title: '解绑电动车',
        content: `解绑电动车${code.value}后无法恢复`,
        confirmText: '解绑',
        success: (res) => {
          if (res.confirm) {
            api
              .disBondScooter({ scooterId: scooterId.value! })
              .then(() => {
                uni.showToast({ title: '解绑成功', icon: 'success' });
                uni.navigateBack();
              })
              .catch((err) => {
                uni.showToast({ title: err.message, icon: 'none' });
              });
          }
        },
      });
    };
    return {
      code,
      flag,
      reject,
      handleFocus,
      handleBlur,
      focus,
      firstEnter,
      chargingTime,
      selectChargingTime,
      checked,
      completeDesc,
      submitbond,
      stationList,
      selectStation,
      stationSelected,
      disbondScooter,
    };
  },
};
</script>

<style scoped>
.content {
  position: absolute;
  width: 100vw;
  height: 100%;
  opacity: 1;
  background: #f3f3f3;
  overflow-x: hidden;
}

.title {
  position: absolute;
  left: 230rpx;
  top: 200rpx;
  width: 300rpx;
  height: 28rpx;
  opacity: 1;

  /* 二级文字/加粗 */
  font-family: PingFangSC-Semibold;
  font-size: 50rpx;
  font-weight: normal;
  line-height: 50rpx;
  text-align: center;
  color: #000000;
}

.bond {
  position: absolute;
  left: 78rpx;
  top: 850rpx;
  width: 605rpx;
  height: 100rpx;
  border-radius: 30rpx;
  opacity: 1;

  background: #ffffff;

  box-sizing: border-box;
  border: 3px solid #f3c649;

  box-shadow: 0px 4px 10px 0px rgba(243, 198, 73, 0.2);
}

.input-area {
  position: absolute;
  left: 78rpx;
  top: 290rpx;
  width: 605rpx;
  height: 120rpx;
  border-radius: 30rpx;
  opacity: 1;

  background: #ffffff;

  box-sizing: border-box;
  border: 3px solid #f3c649;

  box-shadow: 0px 4px 10px 0px rgba(243, 198, 73, 0.2);
}

.place-holder {
  position: absolute;
  left: 260rpx;
  top: 327rpx;
  width: 245rpx;
  opacity: 1;
  display: block;

  font-family: PingFangSC-Regular;
  font-size: 39rpx;
  font-weight: normal;
  text-align: center;
  letter-spacing: 0px;
  color: #9e9e9e;
}

.word-fadeout {
  animation: word-slideout 0.8s both;
}

.word-fadein {
  animation: word-slidein 0.8s both;
}

.right-fadein {
  animation: right-slidein 0.8s both;
}

.right-fadeout {
  animation: right-slideout 0.8s both;
}

.input-fadein {
  width: 100%;
  animation: input-slidein 0.8s both;
}

.input {
  position: absolute;
  left: 120rpx;
  top: 318rpx;
  width: 400rpx;
  height: 70rpx;
  opacity: 1;

  font-family: PingFangSC-Semibold;
  font-size: 60rpx;
  font-weight: normal;
  text-align: center;
  letter-spacing: 4rpx;

  color: #f4b400;
}

.small-title {
  position: absolute;
  left: 90rpx;
  top: 430rpx;
  height: 15rpx;
  opacity: 1;
  font-family: SourceHanSansCN-Regular;
  font-size: 24rpx;
  font-weight: normal;

  color: #aaaaaa;
}

.charging-time {
  position: absolute;
  left: 90rpx;
  top: 480rpx;
  width: 445rpx;
  height: 21rpx;
  opacity: 1;

  font-family: PingFangSC-Regular;
  font-size: 32rpx;
  font-weight: normal;
  line-height: 24rpx;
  letter-spacing: 0px;

  color: #000000;
}

.modify {
  position: absolute;
  left: 600rpx;
  top: 480rpx;
  width: 330rpx;
  height: 21rpx;
  opacity: 1;

  font-family: PingFangSC-Regular;
  font-size: 32rpx;
  font-weight: normal;
  line-height: 24rpx;

  /* 主要色/主要色 */
  color: #0256ff;
}

.go {
  position: absolute;
  left: 283rpx;
  top: 290rpx;
  width: 120rpx;
  height: 116rpx;
  border-radius: 0rpx 30rpx 30rpx 0rpx;
  opacity: 1;
  background: #f3c649;
}

.arrow-right {
  width: 45%;
  height: 45%;
  position: absolute;
  left: 30%;
  top: 30%;
  transform: rotate(-90deg);
  z-index: 2;
}

@keyframes word-slideout {
  100% {
    transform: translateX(-80rpx);
    opacity: 0;
  }
}

@keyframes word-slidein {
  0% {
    transform: translateX(-80rpx);
    opacity: 0;
  }

  100% {
    transform: translateX(0rpx);
    opacity: 1;
  }
}

@keyframes right-slidein {
  0% {
    width: 0rpx;
    left: 680rpx;
  }

  100% {
    width: 120rpx;
    left: 560rpx;
  }
}

@keyframes right-slideout {
  0% {
    width: 120rpx;
    left: 560rpx;
  }

  100% {
    width: 0rpx;
    left: 680rpx;
  }
}

@keyframes input-slidein {
  0% {
    left: 240rpx;
  }

  100% {
    left: 110rpx;
  }
}

.main-picture {
  position: absolute;
  width: 800rpx;
  height: 347rpx;
  opacity: 1;
  background: linear-gradient(90deg, #f3c649 0%, #f3c649 13%, #ffffff 72%), #ffffff;
}

.picture {
  position: absolute;
  left: 40rpx;
  top: 16rpx;
  width: 330rpx;
  height: 330rpx;
  opacity: 1;
}

.number {
  position: absolute;
  left: 461rpx;
  top: 145rpx;
  width: 150rpx;
  height: 60rpx;
  opacity: 1;

  font-family: PingFangSC-Semibold;
  font-size: 66rpx;
  font-weight: normal;
  line-height: 44rpx;
  letter-spacing: 0px;

  color: #000000;
}

.checked {
  /* 已认证 */
  position: absolute;
  left: 550rpx;
  top: 206rpx;
  width: 150rpx;
  height: 160rpx;
  opacity: 1;

  font-family: PingFangSC-Semibold;
  font-size: 32rpx;
  font-weight: normal;
  letter-spacing: 0.3rpx;
}

.checked-color {
  color: #067945;
}

.circle-color1 {
  background-color: #067945;
}

.circle-color2 {
  background-color: #921517;
}

.circle-color3 {
  background-color: #929292;
}

.unchecked-color {
  color: #929292;
}

.checking-color {
  color: #921517;
}

.checking {
  position: absolute;
  left: 550rpx;
  top: 252rpx;
  width: 150rpx;
  height: 160rpx;
  opacity: 1;

  font-family: PingFangSC-Semibold;
  font-size: 32rpx;
  font-weight: normal;
  letter-spacing: 0.3rpx;
}

.circle1 {
  position: absolute;
  left: 514rpx;
  top: 214rpx;
  width: 30rpx;
  height: 30rpx;
  opacity: 1;
  border-radius: 50%;
}

.circle2 {
  position: absolute;
  left: 514rpx;
  top: 260rpx;
  width: 30rpx;
  height: 30rpx;
  opacity: 1;
  border-radius: 50%;
}

.icon1 {
  position: absolute;
  width: 3%;
  height: 7%;
  left: 518rpx;
  top: 218rpx;
}

.icon2 {
  position: absolute;
  width: 3%;
  height: 7%;
  left: 518rpx;
  top: 260rpx;
}

.delete-container {
  /* 强按钮/大尺寸 */
  position: absolute;
  top: 400rpx;
  left: 35rpx;
  border-radius: 2rpx;
}

.delete {
  position: static;
  width: 686rpx;
  height: 88rpx;
  opacity: 1;
  align-items: center;

  font-family: PingFangSC-Regular;
  font-size: 34rpx;
  font-weight: normal;
  line-height: 88rpx;
  text-align: center;
  letter-spacing: 2rpx;

  /* 文字&图标色/Font Wh1 100% */
  color: #ffffff;
  background-color: #c9353f;
  z-index: 0;
}
</style>
