<template>
  <div class="head">
    <image src="../../static/logo_main.png" style="height: 20vmin; width: 20vmin;" mode="aspectFit" />
  </div>
  
  <div class="ctn">
    <!-- 如果当前正在充电，则显示充电剩余时间，提供"提前结束"按钮 -->
    <div v-if="inProgressHistory" :style="{ width: widthStyle }" class="inProgressHistoryCard">
      <div class="total_time">
        <image src="../../static/charging.svg" style="height: 60rpx; width: 60rpx" />
        <div class="charging_time">{{ inProgressHistory.expectHour }}小时</div>
      </div>
      <div class="in_charging">
        <div class="navigation_white" :style="{ height: navigationHeight + 'px' }"></div>
        <div class="charging_info">
          <div class="infotext">
            <p style="font-size: 32rpx; font-weight: bold; letter-spacing: 0; color: #3d3d3d">
              {{ inProgressHistory.scooterCode }} 预计{{ timeFormatter(inProgressHistory.end!) }}充满
            </p>
            <p style="font-size: 24rpx; font-weight: normal; letter-spacing: 0px; color: rgba(0, 0, 0, 0.4)">
              {{ inProgressHistory.stationName }} {{ inProgressHistory.pileName }}充电桩
            </p>
          </div>
          <div class="pre_end" @click="finishCharging">
            <p>提前结束</p>
          </div>
        </div>
      </div>
    </div>

    <!-- isUserAuditing参数默认为false，在onShow函数中获得用户信息后会被修改为true -->
    <div v-if="isUserAuditing" class="main_com">
      <!-- 显示最近充电站的距离 -->
      <div class="charging_station">
        <p class="charging_station_name">
          {{ nearestStationInfo?.name }}
        </p>
        <div class="more_info">
          <div style="display: flex; flex-direction: row; align-items: center">
            <image src="../../static/map-pin.svg" style="width: 24rpx; height: 24rpx; margin-right: 10rpx" />
            <p>距离{{ distanceToNearestStation }}</p>
          </div>
        </div>
      </div>
      <div class="scan_to_charge_ctn">
        <div />
        <!-- 如果用户已经被拉黑或者当前正有电动车充电，则提示用户 -->
        <div v-if="isUserNormal === false" class="start_bond" @click="showBlackReason">
          <image src="../../static/bond.svg" style="width: 75.26rpx; height: 43.16rpx; padding: 7px" />
          <p>您已被拉黑</p>
        </div>
        <div v-else-if="inProgressHistory" class="scan_to_charge">
          <image src="../../static/battery.svg" style="width: 75.26rpx; height: 43.16rpx; padding: 7px" />
          <div>
            <p>正在充电中</p>
          </div>
        </div>
        <!-- 如果用户当前存在状态正常的电动车，则提示扫码充电，并显示最近充电站的空闲情况 -->
        <div
          v-else-if="
            scootersDetail.filter((scooter) => {
              return scooter.status === 'Normal';
            }).length > 0
          "
          class="scan_to_charge"
          @click="startScan"
        >
          <image src="../../static/battery.svg" style="width: 75.26rpx; height: 43.16rpx; padding: 7px" />
          <div>
            <p>扫码充电</p>
            <div v-if="nearestStationInfo?.stat" class="station_state">
              <span style="font-weight: bolder; color: #056334; font-family: SimHei; margin-right: 8rpx"
                >{{ nearestStationInfo?.stat?.free + '空闲' }}
              </span>
              <span style="color: rgba(0, 0, 0, 0.2)">|</span>
              <span style="font-weight: bolder; color: rgba(5, 99, 52, 0.6); font-family: SimHei; margin-left: 8rpx"
                >{{ nearestStationInfo?.stat?.soon + '即将空闲' }}
              </span>
            </div>
          </div>
        </div>
        <!-- 如果用户没有状态正常的电动车，且有电动车正在审核，则提示用户 -->
        <div
          v-else-if="
            scootersDetail.filter((scooter) => {
              return scooter.status === 'Auditing';
            }).length > 0
          "
          class="start_bond"
        >
          <image src="../../static/bond.svg" style="width: 75.26rpx; height: 43.16rpx; padding: 7px" />
          <p>小电驴正在审核中</p>
        </div>
        <!-- 用户没有绑定电动车，提示用户 -->
        <div v-else class="start_bond" @click="bindScooter">
          <image src="../../static/bond.svg" style="width: 75.26rpx; height: 43.16rpx; padding: 7px" />
          <p>绑定小电驴</p>
        </div>
        <div class="divider-color" style="width: calc(100% - 32rpx); height: 2rpx; margin-top: 32rpx"></div>
      </div>
      <!-- 举报、查看历史 -->
      <div class="operation">
        <div class="report" style="display: flex; flex-direction: row; align-items: center" @click="startReport">
          <image src="../../static/flag.svg" style="width: 36rpx; height: 38rpx; padding: 7px" />
          举报违规
        </div>
        <div class="divider-color" style="height: 64rpx; width: 2rpx"></div>
        <div class="history" style="display: flex; flex-direction: row; align-items: center" @click="jumpChargeHistory">
          <image src="../../static/clock.svg" style="width: 36rpx; height: 38rpx; padding: 7px" />
          充电历史
        </div>
      </div>
    </div>
    <div v-else-if="!isLogin" class="main_com">
      <!-- <div class="scan_to_charge_ctn"> -->
        <div class="font-title" style="margin-bottom: 16rpx">账号未登录，请前往“我的”页面登录账号</div>
      <!-- </div> -->
    </div>
    <div v-else-if="isUserNormal === false" class="main_com">
      <div class="scan_to_charge_ctn">
        <div class="font-title" style="margin-bottom: 16rpx">账号未登记</div>
        <!-- <div class="font-body">现在用来debug的userId:{{ userId }}</div> -->
        <div style="font-size: 36rpx; font-weight: bolder">请完善个人信息，添加电动车后找管理员进行登记</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import api from '@/api/index';
import { onPageScroll, onReachBottom, onShow } from '@dcloudio/uni-app';
import { useTrack } from '@/business/track/useTrack';
import { useCharge } from '@/pages/charging/useCharge';
// import Divider from '../components/divider/divider.vue';
import { ScooterProfileVO } from '@/api/scooter';
// import NewsBrief from '@/pages/components/newsBrief/newsBrief.vue';
import { onLoad } from '@dcloudio/uni-app';
import { nextTick, ref } from 'vue';
// import BottomLoadingPrompt from '../components/bottomLoadingPrompt/bottomLoadingPrompt.vue';
import { Role, UserBlackListReasonVO } from '@/api/user';
import { timeFormatter } from '@/utils/timeformatter';
// const props = defineProps(['chargingStatus']);

// const emit = defineEmits(['changeStatus']);

const {
  inProgressHistory,
  updateInProgressHistory,
  // getNews,
  // newsList,
  // getBanner,
  // bannerList,
  getStationList,
  nearestStationInfo,
  distanceToNearestStation,
  // newsListHasMore,
} = useCharge();

const { doTrack, PageId, EventId } = useTrack();

const scootersDetail = ref<ScooterProfileVO[]>([]);

const trackService = useTrack();

const bindScooter = () => {
  uni.navigateTo({
    url: `/pages/my/edit/edit?haveScooter=false`,
  });
};
const isAuditing = ref(false);
const userId = ref(uni.getStorageSync('userId'));
const isUserNormal = ref(false);
const status = ref<Role>(uni.getStorageSync('status') || 'None');
const isUserAuditing = ref<boolean>(false);
// const isLoadingNews = ref(false);
const isLogin = ref(!(uni.getStorageSync('auth') === ''));

onLoad(async () => {
  trackService.doTrack({
    pgid: trackService.PageId.My,
    eid: '',
    eventId: trackService.EventId.IMPL,
  });
  // uni.showLoading({ title: '加载中', mask: true });
});

onShow(async () => {
  getStationList();
  // getNews();
  // getBanner();
  await nextTick();
  console.log('🚀 ~ file: index.vue:206 ~ onShow ~ status.value:', status.value);

  if (status.value === 'None') {
    const { data: userInfo } = await api.getUserInfo();
    status.value = userInfo.role;
  }

  if (status.value !== 'None') {
    updateInProgressHistory();
    await api
      .getUserStatus()
      .then((res) => {
        uni.hideLoading();
        if (res.data.normal === true) {
          isUserNormal.value = true;
        }
        isUserAuditing.value = true;
        if (res.data.blackListReason) {
          blackListReason.value = res.data.blackListReason;
        }
      })
      .catch((err) => {
        console.log('🚀 ~ file: index.vue:222 ~ onShow ~ err:', err);
        if (err.data?.code === '40005') {
          isUserNormal.value === false;
        }
        uni.showModal({
          title: '加载失败',
          content: err.message,
        });
      });
    await api
      .getUserScooterList({
        pageNum: 1,
        pageSize: 50,
      })
      .then((res) => {
        scootersDetail.value = res.data.data.filter((scooter) => {
          return scooter.status === 'Normal' || scooter.status === 'Auditing';
        });
      })
      .catch((err) => {
        if (err.data.code === '40005') {
          isAuditing.value = true;
        }
      })
      .finally(() => {
        console.log('ntm');
      });
  }
  userId.value = uni.getStorageSync('userId');
});

// 触底加载
// onReachBottom(async () => {
//   if (newsListHasMore.value && !isLoadingNews.value) {
//     isLoadingNews.value = true;
//     await getNews();
//     isLoadingNews.value = false;
//   } else {
//     console.log('🚀 ~ file: index.vue:240 ~ onReachBottom ~ newsListHasMore.value:', newsListHasMore.value);
//   }
// });

// 吸附
const navigationHeight = ref(0);
const widthStyle = ref('calc(100% - 64rpx)');
const calNum = ref(1);
onPageScroll(({ scrollTop }) => {
  if (scrollTop > 232) {
    if (scrollTop < 320) {
      calNum.value = (320 - scrollTop) / 88;
      widthStyle.value = 'calc(100% - ((100% - 349px) * ' + calNum.value + ' ))';
      navigationHeight.value = ((scrollTop - 232) / 88) * 88;
    } else {
      widthStyle.value = '100%';
      navigationHeight.value = 88;
    }
  } else {
    navigationHeight.value = 0;
    widthStyle.value = 'calc(100% - 64rpx)';
  }
});

// 选项框

const jumpChargeHistory = () => {
  uni.navigateTo({ url: './chargeHistory/index' });
};

// 扫码
const startScan = () => {
  doTrack({
    pgid: PageId.Charge,
    eid: 'scan_to_charge_btn',
    eventId: EventId.CLIK,
  });
  uni.scanCode({
    onlyFromCamera: true,
    scanType: ['wxCode'],
    success: (res) => {
      if (res.scanType === 'WX_CODE' && res.path) {
        if (res.path.indexOf('type=charging') !== -1) {
          const query = res.path.replaceAll('&type=charging', '');
          uni.navigateTo({ url: `/pages/charging/prepareCharge/index${query}` });
        }
      } else {
        uni.showModal({
          title: '二维码解析失败',
          content: '请扫描正确的二维码',
          showCancel: false,
        });
      }
    },
    fail: (error) => {
      const message = error.errMsg;
      if (message !== 'scanCode:fail cancel') {
        uni.showModal({
          title: '二维码解析失败',
          content: '请扫描正确的二维码',
          showCancel: false,
        });
      }
    },
  });
};
// 举报
const startReport = () => {
  uni.navigateTo({
    url: `/pages/report/report?whichKind=stationId&stationName=${nearestStationInfo.value?.name}&stationId=${nearestStationInfo.value?.stationId}`,
  });
};

const finishCharging = () => {
  uni.showModal({
    title: '结束充电',
    content: '请问要提前结束充电吗',
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定');
        api
          .endChargeScooter({
            scooterId: scootersDetail.value[0].scooterId!,
          })
          .then(() => {
            updateInProgressHistory();
            getStationList();
          });
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
};

// 处理图片加载失败
/*const handlePicError = (index: number) => {
  bannerList.value[index].fail = true;
};*/

// 点击跳转news
/*const clickNotification = (newsId?: number) => {
  if (newsId) {
    uni.navigateTo({ url: `/pages/components/news/news?newsId=${newsId}` });
  }
};*/

// 黑名单原因
const blackListReason = ref<UserBlackListReasonVO>();

const showBlackReason = () => {
  if (!blackListReason.value) {
    return;
  }
  uni.showModal({
    title: '拉黑原因',
    showCancel: false,
    content: `拉黑充电站：${blackListReason.value.stationName}\r\n拉黑管理员：${
      blackListReason.value.managerName
    }\r\n原因：${blackListReason.value.reason}\r\n解封时间：${timeFormatter(blackListReason.value.due)}`,
  });
};
</script>

<style scoped lang="less">
.head {
  height: 40vh;
  width: 100vw;
  background-color: green;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ctn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.swiper {
  z-index: -99999;
  position: absolute;
  top: 0px;
  width: 100%;
  height: 682rpx;
}

.swiper_dots {
  width: 100%;
  border-radius: 4rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2vh;
}

.swiper_dot {
  width: 26rpx;
  height: 8rpx;
  gap: 0px;
  background-color: #d8d8d8;
  padding: 0px;
  margin: 0px;
  border: 0px;
}

.navigation_white {
  width: 100%;
  z-index: 100;
  background-color: #fff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
}

.main_com {
  // width: calc(100% - 64rpx);
  margin-left: 32rpx;
  margin-right: 32rpx;
  padding: 0rpx;
  height: 50vh;
  // background: #ffffff;
  // box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
  // box-sizing: border-box;
}

.charging_station {
  padding-top: 18rpx;
  padding-left: 20rpx;
}

.charging_station_name {
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 0px;
  color: #3d3d3d;
}

.more_info {
  font-size: 24rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  color: rgba(0, 0, 0, 0.4);
}

.scan_to_charge_ctn {
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scan_to_charge {
  font-size: 48rpx;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.start_bond {
  font-size: 48rpx;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.operation {
  padding: 16rpx 32rpx 32rpx 32rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 40rpx;
  font-weight: 500;
  height: 100%;
}

.notifications {
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 20rpx;
  margin-left: 26rpx;
  margin-right: 26rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.in_charging {
  height: 108rpx;
  position: sticky;
  top: 0px;
  margin-bottom: 22rpx;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
  z-index: 100000;
}

.total_time {
  display: flex;
  flex-direction: row;
  z-index: 0;
  width: 698rpx;
}

.charging_time {
  width: 112rpx;
  height: 60rpx;
  background: #d8d8d8;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.charging_info {
  width: 100%;
  height: 108rpx;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.infotext {
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.pre_end {
  width: 100rpx;
  height: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4rpx;
  box-sizing: border-box;
  border: 0.5px solid #b11f26;
  font-size: 20rpx;
  font-weight: normal;
  text-align: center;
  color: #b11f26;
  margin-right: 38rpx;
}

.inProgressHistoryCard {
  top: -60rpx;
  position: sticky;
  box-sizing: border-box;
}

.station_state {
  font-size: 22rpx;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12rpx;
  padding: 8rpx 12rpx 8rpx 12rpx;
}
</style>
