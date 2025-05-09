<template>
  <div class="navigationBar" />
  <div class="container">
    <div class="reportWhich">
      <p class="union ctn" style="padding-top: 8px">关联</p>
      <div v-if="whichKind === 'chargeHistory'">
        <div class="ctn">
          <p class="exactUnion">{{ dateFormatter(chargeHistoryDetail?.begin!) }}的充电记录</p>
          <p class="chargingStatus text">
            {{ chargeHistoryDetail?.stationName }} {{ chargeHistoryDetail?.pileName }}
            {{ statusFormatter(chargeHistoryDetail?.status!) }}
          </p>
          <div class="start time text">
            <p>开始时间</p>
            <p>{{ dateTimeFormatter(chargeHistoryDetail?.begin!) }}</p>
          </div>
          <div class="end time text">
            <p>结束时间</p>
            <p>{{ dateTimeFormatter(chargeHistoryDetail?.end!) }}</p>
          </div>
        </div>
        <div v-if="!isSpread" :class="detailClass" @click="chargeSpread">
          <div class="ctn">
            <div v-if="chargeHistoryDetail?.endPhotoUrl">
              <p class="endPicText text">结束描述图片</p>
              <image class="endPic" :src="chargeHistoryDetail?.endPhotoUrl" mode="scaleToFill" />
            </div>

            <div v-if="chargeHistoryDetail?.moveDesc">
              <p class="endDescriptionTitle text">移车描述</p>
              <p class="endDescription text" style="color: #aaa">
                {{ chargeHistoryDetail?.moveDesc }}
              </p>
            </div>
            <div v-if="chargeHistoryDetail?.movePhotoUrl">
              <p class="endPicText text">移车描述图片</p>
              <image class="endPic" :src="chargeHistoryDetail?.movePhotoUrl" mode="scaleToFill" />
            </div>
            <div class="close text" style="padding-bottom: 8px" @click.stop="changeDetailClass">
              <image src="/static/up.svg" style="height: 4.5px; width: 6px" />隐藏
            </div>
          </div>
        </div>
        <div v-else class="open text ctn" style="padding-bottom: 8px" @click="changeDetailClass">
          <image src="/static/down.svg" style="height: 4.5px; width: 6px" />展开
        </div>
      </div>
      <div v-if="whichKind === 'pile'" class="ctn" style="padding-top: 8px; padding-bottom: 8px">
        <div class="exactUnion">
          <span style="margin-right: 6px">{{ pileDetail?.name }} </span
          ><image src="/static/charging.svg" style="height: 10px; width: 20px" />
        </div>
        <p class="chargingStatus text">{{ pileDetail?.scooterCode }}{{ statusFormatter(pileDetail!.status) }}</p>
        <div v-if="pileDetail!.status === Status.Using">
          <div class="start time text">
            <p>开始时间</p>
            <p>{{ dateTimeFormatter(chargeHistoryDetail?.begin!) }}</p>
          </div>
          <div class="end time text">
            <p>预计结束时间</p>
            <p>{{ dateTimeFormatter(chargeHistoryDetail?.end!) }}</p>
          </div>
        </div>
      </div>
      <div v-if="whichKind === 'stationId'" class="ctn" style="padding-top: 8px; padding-bottom: 8px">
        <div class="exactUnion">
          <span style="margin-right: 6px">{{ stationName }} </span>
        </div>
      </div>
    </div>
    <div class="title">遇到了什么问题？</div>
    <div class="reportTitle" @click="startSelectTitle">
      <div>
        <text class="font-body" style="margin-right: 16rpx">标题</text>
        <text
          class="font-body"
          :style="{
            color: reportTitle ? 'black' : '#9e9e9e',
          }"
          >{{ reportTitle ?? '未选择' }}</text
        >
      </div>
      <image src="/static/chevron-right.svg" style="height: 16px; width: 16px" />
    </div>
    <div class="reportContext">
      <view style="margin-bottom: 12rpx">
        <text class="font-body">举报内容</text>
      </view>
      <input v-model="reportContext" class="inputContext font-body" placeholder="请输入举报内容" :maxlength="-1" />
    </div>
    <div class="attachment">
      <p class="font-body">附件</p>
      <div class="attachmentPic">
        <image
          v-for="(filepath, index) in reportPhotos"
          :key="index"
          class="pic"
          :src="filepath"
          mode="aspectFit"
          style="height: 60px; width: 60px"
          @click="previewImage(filepath)"
        />
        <image src="/static/uploadPic.svg" style="height: 60px; width: 60px" @click="chooseImages" />
      </div>
    </div>
    <div class="submit" @click="addReportContent">
      <p class="submitText">提交</p>
      <p class="submitContext">反馈至{{ stationName }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import api from '@/api';
import { ChargeHistoryItemVO } from '@/api/chargehistory';
import { PileDetailVO } from '@/api/station';
import { onLoad } from '@dcloudio/uni-app';
import { ref, getCurrentInstance } from 'vue';
import { dateFormatter, dateTimeFormatter, timeFormatter } from '@/utils/timeformatter';

enum Status {
  Ended = 'Ended',
  Free = 'Free',
  Repairing = 'Repairing',
  Using = 'Using',
  EndedByOther = 'EndedByOther',
  EndedBySelf = 'EndedBySelf',
  EndedPeacefully = 'EndedPeacefully',
  ForcedEnd = 'ForcedEnd',
  None = 'None',
}

// 判断哪种举报 必须传入pile或chargeHistory
const whichKind = ref('');

// 传参
const stationId = ref<number>();
const pileId = ref<number>();
const chargeHistoryDetail = ref<ChargeHistoryItemVO>();
const stationName = ref('');

// reportId
const reportId = ref(0);

onLoad((options) => {
  if (!options) {
    uni.showModal({
      title: '警告',
      content: '非法操作',
      showCancel: false,
      success: function () {
        uni.navigateBack();
      },
    });
    return;
  }
  if (options.whichKind === 'pile') {
    whichKind.value = options.whichKind;
    stationId.value = Number(options.stationId);
    pileId.value = Number(options.pileId);
    uni.showLoading({ title: '加载中' });
    getPileDetail({ stationId: stationId.value, pileId: pileId.value });
  } else if (options.whichKind === 'chargeHistory') {
    whichKind.value = options.whichKind;
    chargeHistoryDetail.value = {
      ...JSON.parse(options.chargeHistory),
      begin: new Date(JSON.parse(options.chargeHistory).begin),
      end: JSON.parse(options.chargeHistory).end ? new Date(JSON.parse(options.chargeHistory).end) : undefined,
    };
    stationName.value = chargeHistoryDetail.value?.stationName ?? '';
    stationId.value = chargeHistoryDetail.value?.stationId;
  } else if (options.whichKind === 'stationId') {
    whichKind.value = options.whichKind;
    stationName.value = options.stationName;
    stationId.value = Number(options.stationId);
  } else {
    uni.showModal({
      title: '警告',
      content: '非法操作',
      showCancel: false,
      success: function () {
        uni.navigateBack();
      },
    });
  }
  if (stationId.value) {
    api
      .createReport({
        stationId: stationId.value,
        relatedPileId: pileId.value,
        relatedChargeHistoryId: chargeHistoryDetail.value?.chargeHistoryId,
      })
      .then((res) => {
        reportId.value = res.data.reportId;
        console.log(reportId.value);
      });
  }
});

const statusFormatter = (status: Status) => {
  switch (status) {
    case Status.Ended:
      return '已结束';
    case Status.Free:
      return '空闲';
    case Status.Using:
      return '正在充电';
    case Status.EndedByOther:
      return '被确认充满';
    case Status.EndedBySelf:
      return '已充满';
    case Status.EndedPeacefully:
      return '正常到时间结束';
    default:
      return '未知情况';
  }
};

const pileDetail = ref<PileDetailVO>();

const getPileDetail = async ({ stationId, pileId }: { stationId: number; pileId: number }) => {
  api.getPileInfo({ stationId, pileId }).then((res) => {
    pileDetail.value = res.data;
    uni.hideLoading();
  });
};

// 删除元素
const chargeSpread = () => {
  isSpread.value = !isSpread.value;
};
const reportContext = ref('');

const reportPhotos = ref<string[]>([]);
const chooseImages = () => {
  uni.chooseImage({
    sizeType: ['compressed'],
    success: function (res) {
      console.log(res);
      if (!reportPhotos.value) {
        if (Array.isArray(res.tempFilePaths)) {
          reportPhotos.value = res.tempFilePaths;
        } else {
          reportPhotos.value = [res.tempFilePaths];
        }
      } else {
        reportPhotos.value = reportPhotos.value.concat(res.tempFilePaths);
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
    reportPhotos.value = reportPhotos.value?.filter((url) => url !== data.deleteUrl);
  });
};

// 选择问题标题
const reportTitle = ref();
const startSelectTitle = () => {
  uni.navigateTo({ url: '/pages/report/reportTitle/reportTitle' });
  uni.$once('reportTitle', (data) => {
    reportTitle.value = data.reportTitle;
    console.log(data);
  });
};

// 订阅

const reportSubscribeId = '1mdcWLE_Mb5yySKVkujLd6Qg1TX2a4xa8ZF7Md-13R0';
//订阅消息
const subscribeMessage = () => {
  return new Promise((resole, reject) => {
    uni.requestSubscribeMessage({
      tmplIds: [reportSubscribeId],
      success: (res) => {
        if (res['errMsg'] === 'requestSubscribeMessage:ok' || res[reportSubscribeId] === 'accept') {
          resole(true);
        }
        uni.showToast({
          title: '不订阅无法收到举报处理后的通知',
          icon: 'none',
        });
        reject();
        return;
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// 提交举报内容

const addReportContent = async () => {
  try {
    await subscribeMessage();
    if (reportPhotos.value.length === 0) {
      uni.showToast({
        title: '请提交举报照片',
        icon: 'error',
      });
      return;
    }
    uni.showLoading({ title: '提交中' });
    reportPhotos.value!.forEach(async (path: string) => {
      await api.addReportPhoto(reportId.value, path);
      console.log('tijiao');
    });
    await api.addReportContent({ content: reportContext.value, title: reportTitle.value }, reportId.value);
    console.log('kaishitijiao');
    api
      .commitReport(reportId.value)
      .then(async (res) => {
        console.log(res);
        uni.hideLoading();
        uni.navigateTo({ url: `./reportSuccess/reportSuccess?stationName=${stationName.value}` });
      })
      .catch((err) => {
        console.log(err);
        uni.hideLoading();
        uni.showToast({
          title: err.message,
          icon: 'none',
        });
      });
  } catch (error) {
    uni.hideLoading();
    console.error(error);
  }
};

// 展开动画
const detailClass = ref('');
const isSpread = ref(true);
const changeDetailClass = () => {
  if (isSpread.value) {
    isSpread.value = false;
  }
  if (detailClass.value === 'detailOpen') {
    detailClass.value = 'detailClose';
    setTimeout(() => {
      isSpread.value = true;
    }, 750);
  } else {
    detailClass.value = 'detailOpen';
  }
};
</script>

<style scoped>
.navigationBar {
  background-color: #000;
  height: 60px;
  width: 100vw;
  position: absolute;
  border: 0px;
  z-index: -99999;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
}
.union {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0px;
  color: #0256ff;
}
.exactUnion {
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #1a1a1a;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.chargingStatus {
  margin-bottom: 5px;
}
.reportWhich {
  width: calc(100vw - 32rpx);
  height: auto;
  margin-top: 16px;
  margin-bottom: 0px;
  background: white;
}

.ctn {
  padding-left: 9px;
  padding-right: 9px;
  background-color: #fff;
}
.time {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 1px;
}
.text {
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #1a1a1a;
}
.open {
  padding-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.endDescription {
  margin-bottom: 8px;
}
.endPic {
  margin-top: 8px;
  width: 32px;
  height: 32px;
}
.close {
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: flex-end;
  margin-bottom: 8px;
}
.title {
  margin-top: 29px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0px;
  color: #1a1a1a;
  align-self: flex-start;
  margin-left: 9px;
  margin-bottom: 8px;
}
.reportTitle {
  background-color: #fff;
  width: calc(100% - 18px);
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #1a1a1a;
  padding: 9px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.reportContext {
  background-color: #fff;
  width: calc(100% - 18px);
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #1a1a1a;
  padding: 9px;
  margin-bottom: 8px;
}
.inputContext {
  width: auto;
}
.attachment {
  background-color: #fff;
  width: calc(100% - 18px);
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #1a1a1a;
  padding: 9px;
  margin-bottom: 8px;
}

.attachmentPic {
  margin-top: 12px;
  display: flex;
  flex-direction: row;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.pic {
  height: 60px;
  width: 60px;
}
.submit {
  position: fixed;
  bottom: 16px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background: #0052d9;
  width: calc(100vw - 32rpx);
  margin: 16px;
  flex-direction: column;
}
.submitText {
  font-size: 16px;
  color: #fff;
}
.submitContext {
  font-size: 10px;
  color: #fff;
}

.detailOpen {
  animation: fadeInDown;
  animation-duration: 1s;
  height: 100%;
  overflow: hidden;
}
.detailClose {
  animation-name: flipOutX;
  animation-duration: 1s;
  height: 100%;
  overflow: hidden;
}
</style>
