<!--TODO: 开始充电按钮 --->
<template>
  <div class="title1">核对信息，然后开始充电</div>
  <div class="station-info">
    <span class="info-content">充电桩信息</span>
    <span class="info-report">
      <span class="report-text" @click="startReport">举报</span>
      <image class="report-icon" src="../../../static/chevron-right.svg" />
    </span>
  </div>

  <div v-if="pileDetail?.status === 'Free' || pileDetail?.status === 'Ended'" class="content free" style="height: 45px">
    <view>
      <span class="font-body" style="margin-right: 8rpx">{{ station?.name }}</span>
      <span class="font-body" style="font-weight: bold"> {{ pileDetail?.name }}</span>
    </view>
    <span v-if="pileDetail?.status === 'Ended'" class="font-body" style="font-size: 12px"
      >{{ pileDetail?.scooterCode }}已经充电结束</span
    >
    <span class="font-body" style="font-weight: bold; color: green">空闲</span>
  </div>
  <div v-if="pileDetail?.status === 'Using'" class="content" style="height: auto">
    <span style="font-size: 18px; font-weight: bold; top: 11px; left: 11px; position: relative">
      {{ pileDetail?.name }}</span
    >
    <span
      style="
        font-size: 18px;
        font-weight: bold;
        top: 11px;
        right: 11px;
        position: relative;
        color: #b11f26;
        float: right;
      "
    >
      被占用</span
    >
    <div class="status-content">
      {{ pileDetail?.scooterCode }}正在使用，预计结束时间{{ timeFormatter(pileDetail?.end!) }}。 若充电完成，请拍摄照片
    </div>
    <div>
      <image
        v-if="finishScooterPositionPic"
        class="upload-img"
        :src="finishScooterPositionPic"
        mode="aspectFit"
        style="height: 60px; width: 60px"
        @click="previewImage(finishScooterPositionPic)"
      />
      <image v-else src="/static/uploadPic.svg" class="upload-img" @click="chooseImages('finish')" />
    </div>

    <div class="status-content">拔掉对方插头后，请将电动车移出站点。请在下方告知移车位置</div>
    <image
      v-if="moveScooterPositionPic"
      class="upload-img"
      :src="moveScooterPositionPic"
      mode="aspectFit"
      style="height: 60px; width: 60px"
      @click="previewImage(moveScooterPositionPic)"
    />
    <image v-else src="/static/uploadPic.svg" class="upload-img" @click="chooseImages('move')" />
    <input v-model="moveCardInput" placeholder="若照片无法展示清楚，请输入描述" style="padding-left: 16px" />
  </div>

  <div class="vehicle-info">你的电动车</div>
  <div v-if="scooterList.length > 0" class="vehicle-content">
    <picker
      style="padding-top: 4px; margin-left: 12px; margin-bottom: 7px; font-size: 24px; font-weight: bold"
      :value="whichScooter"
      :range="scooterList"
      range-key="code"
      @change="changeScooter"
    >
      <div class="my-scooter-content">
        <span>{{ scooterList[whichScooter].code }}</span>
        <image style="width: 24px; height: 24px" src="../../../static/chevron-right.svg" />
      </div>
    </picker>

    <picker
      style="position: relative; margin-bottom: 7px; margin-left: 12px; font-size: 16px"
      :range="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
      :value="scooterList[whichScooter].expectHour! - 1"
      @change="changeExpectHour"
    >
      <div class="my-scooter-content">
        <span>充{{ scooterList[whichScooter].expectHour }}小时</span>
        <image style="width: 24px; height: 24px" src="../../../static/chevron-right.svg" />
      </div>
    </picker>

    <div
      class="my-scooter-content"
      style="position: relative; margin-bottom: 7px; margin-left: 12px; font-size: 16px"
      @click="changeDesc"
    >
      <span>{{ scooterList[whichScooter].completeDesc }}</span>
      <image style="width: 24px; height: 24px" src="../../../static/chevron-right.svg" />
    </div>
  </div>
  <button class="submit" @click="startCharge">开始充电</button>
</template>

<script lang="ts" setup>
import api from '@/api';
import scooter, { ScooterVO } from '@/api/scooter';
import { PileDetailVO, StationBriefVO, Status } from '@/api/station';
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { DirectUploadInfo } from '@/api/report';
import { timeFormatter } from '@/utils/timeformatter';

const station = ref<StationBriefVO>();
const pileDetail = ref<PileDetailVO>();
const scooterList = ref<ScooterVO[]>([]);
const endPhotoDirectUploadInfo = ref<DirectUploadInfo>();
const movePhotoDirectUploadInfo = ref<DirectUploadInfo>();
const subscribeMessageTemplateIdList = [
  'vkZDzsDbC9dtWpX7xOe6-cvzdRLTvbghiyvUNeAdDgw',
  'GdVxZLWuH2Wi0QP1RApkYcAEocmen9553zmuIBEcN7M',
];

const getStationInfo = async ({ stationId }: { stationId: number }) => {
  try {
    const res = await api.getStationInfo({ stationId });
    station.value = res.data;
  } catch (e) {
    console.log(e);
  }
};

const getPileDetail = async ({ stationId, pileId }: { stationId: number; pileId: number }) => {
  api.getPileInfo({ stationId, pileId }).then((res) => {
    if (res.data.status === 'Repairing') {
      uni.showModal({
        title: '警告',
        content: '本充电桩已坏，若以修复请联系管理员',
        showCancel: false,
        success: function (res) {
          uni.navigateBack();
        },
      });
    } else {
      pileDetail.value = { ...res.data, end: res.data.end ? new Date(res.data.end) : undefined };
    }
  });
};
const getScooterList = async () => {
  api.getUserScooterList({ pageNum: 1, pageSize: 100 }).then((res) => {
    scooterList.value = res.data.data.filter((scooter) => {
      return scooter.status === 'Normal';
    });
  });
};

const moveCardInput = ref('');

// 选择照片
const finishScooterPositionPic = ref<string>('');
const moveScooterPositionPic = ref<string>('');
const chooseImages = (which: string) => {
  uni.chooseImage({
    sizeType: ['compressed'],
    sourceType: ['camera'],
    count: 1,
    success: function (res) {
      switch (which) {
        case 'finish':
          finishScooterPositionPic.value = res.tempFilePaths.toString();
          break;
        case 'move':
          moveScooterPositionPic.value = res.tempFilePaths.toString();
          break;
      }
    },
  });
};
const previewImage = (url: string) => {
  uni.navigateTo({
    url: '/pages/components/previewPhoto/previewPhoto',
    success: (res) => {
      res.eventChannel.emit('previewPhotoUrl', { photoUrl: url });
    },
  });
  uni.$once('deleteUrl', (data) => {
    if (data.deleteUrl === finishScooterPositionPic.value) {
      finishScooterPositionPic.value = '';
    } else if (data.deleteUrl === moveScooterPositionPic.value) {
      moveScooterPositionPic.value = '';
    }
  });
};

// 选择电驴
const whichScooter = ref(0);
const changeScooter = (e: any) => {
  whichScooter.value = e.detail.value;
};

// 更改充电时间
const changeExpectHour = (e: any) => {
  scooterList.value[whichScooter.value].expectHour = Number(e.detail.value) + 1;
};

// 更改结束充电描述
const changeDesc = () => {
  uni.showModal({
    title: '充电结束时的描述',
    content: scooterList.value[whichScooter.value].completeDesc,
    showCancel: true,
    editable: true,
    success: ({ confirm, content }) => {
      if (confirm) {
        scooterList.value[whichScooter.value].completeDesc = content;
      }
    },
  });
};

const stationId = ref<number>(1);
const pileId = ref<number>(2);
// const canUsePush = ref<boolean>(false);

onLoad(async (data) => {
  try {
    // getPushPermission();
    uni.showLoading({ title: '加载中', mask: true });
    console.log(pileDetail.value);
    stationId.value = Number(data.stationId);
    pileId.value = Number(data.pileId);
    getStationInfo({ stationId: stationId.value });
    getPileDetail({ stationId: Number(data.stationId), pileId: Number(data.pileId) });
    getScooterList();
    uni.hideLoading();
    console.log(data);
  } catch (error) {}
});

// const getPushPermission = () => {
//   uni.getSetting({
//     withSubscriptions: true,
//     success: (res) => {
//       for (let id in subscribeMessageTemplateIdList) {
//         if (res.subscriptionsSetting.itemSettings[id] !== 'accept') {
//           return;
//         }
//         canUsePush.value = true;
//       }
//     },
//   });
// };

// const requestPushPermission = () => {
//   return new Promise<void>((resolve, reject) => {
//     console.log('请求退缩');

//     uni.requestSubscribeMessage({
//       tmplIds: subscribeMessageTemplateIdList,
//       success: (res) => {
//         if (
//           res['errMsg'] !== 'requestSubscribeMessage:ok' ||
//           res[subscribeMessageTemplateIdList[0]] !== 'accept' ||
//           res[subscribeMessageTemplateIdList[1]] !== 'accept'
//         ) {
//           uni.showToast({
//             title: '不进行消息订阅无法收到通知',
//             icon: 'none',
//             duration: 4000,
//           });
//           reject();
//           return;
//         }
//         resolve();
//       },
//       fail: () => {
//         reject();
//       },
//     });
//   });
// };

// 举报
const startReport = () => {
  uni.navigateTo({
    url: `/pages/report/report?stationId=${stationId.value}&pileId=${pileId.value}&whichKind=pile`,
  });
};

// 开始充电
const startCharge = async () => {
  if (pileDetail.value?.status === 'Using' && !(finishScooterPositionPic.value && moveScooterPositionPic.value)) {
    uni.showToast({ title: '请上传照片', icon: 'error' });
    return;
  }
  if (finishScooterPositionPic.value) {
    await api.addChargePhoto(finishScooterPositionPic.value).then((res) => {
      endPhotoDirectUploadInfo.value = res;
    });
  }
  if (moveScooterPositionPic.value) {
    await api.addChargePhoto(moveScooterPositionPic.value).then((res) => {
      movePhotoDirectUploadInfo.value = res;
    });
  }
  await api
    .chargeScooter(scooterList.value[whichScooter.value].scooterId, stationId.value, pileId.value, {
      endPhotoPath: endPhotoDirectUploadInfo.value?.path,
      expectHour: scooterList.value[whichScooter.value].expectHour,
      moveDesc: scooterList.value[whichScooter.value].completeDesc,
      movePhotoPath: movePhotoDirectUploadInfo.value?.path,
    })
    .then(() => {
      uni.showToast({
        title: '充电成功',
        icon: 'success',
        duration: 2000,
      });
      uni.requestSubscribeMessage({
        tmplIds: subscribeMessageTemplateIdList,
        success: (res) => {
          // console.log('完成请求消息推送');
          if (
            res['errMsg'] === 'requestSubscribeMessage:ok' ||
            res[subscribeMessageTemplateIdList[0]] === 'accept' ||
            res[subscribeMessageTemplateIdList[1]] === 'accept'
          ) {
            uni.showToast({
              title: '订阅成功',
              icon: 'success',
              duration: 2000,
            });
          } else {
          }
          uni.showToast({
            title: '不进行消息订阅无法收到通知',
            icon: 'none',
            duration: 4000,
          });
          uni.navigateBack();
        },
        fail: () => {
          uni.showToast({
            title: '不进行消息订阅无法收到通知',
            icon: 'none',
            duration: 4000,
          });
          uni.navigateBack();
        },
        complete: () => {
          console.log('请求发送通知');
        },
      });
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        duration: 4000,
      });
    });
};
</script>

<style scoped>
.title1 {
  height: 35px;
  font-family: SourceHanSansCN-Bold;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0px;
  padding-top: 32px;
  margin-left: 16px;
  /* 正文色/正文色 */
  color: #1a1a1a;
}

.station-info {
  padding-top: 44px;
  margin-left: 16px;
  margin-right: 16px;
  padding-bottom: 6px;
}

.info-content {
  width: 80px;
  height: 23px;
  font-family: SourceHanSansCN-Bold;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0px;

  /* 正文色/正文色 */
  color: #1a1a1a;
}

.info-report {
  float: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.report-text {
  width: 26px;
  height: 19px;
  font-family: SourceHanSansCN-Regular;
  font-size: 13px;
  font-weight: normal;
  text-align: right;
  letter-spacing: 0px;
  color: #3d3d3d;
}

.report-icon {
  width: 16px;
  height: 16px;
}

.content {
  width: auto;
  background-color: white;
  margin: 0rpx 32rpx 32rpx 32rpx;
}

.free {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 12px;
  padding-right: 12px;
}

.vehicle-info {
  margin-left: 16px;
  width: 80px;
  height: 23px;
  font-family: SourceHanSansCN-Bold;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0px;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.vehicle-content {
  width: auto;
  margin-left: 16px;
  margin-right: 16px;
  height: 130px;
  background-color: white;
}

.status-content {
  margin-left: 12px;
  margin-top: 15px;
  padding-right: 16px;
  font-family: SourceHanSansCN-Regular;
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  /* 设置超出多少行隐藏 */
  -webkit-box-orient: vertical;
  color: #1a1a1a;
}

.upload-img {
  width: 80px;
  height: 80px;
  margin-left: 12px;
  margin-top: 6px;
  /* 功能色/中性色/Gray1-Hover */
  background: #f3f3f3;
}

.my-scooter-content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.submit {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0052d9;
  margin: 16px;
  flex-direction: column;
  color: #fff;
  border-radius: 2px;
  font-size: 16px;
}
</style>
