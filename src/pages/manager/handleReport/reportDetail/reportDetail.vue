<template>
  <view class="container">
    <div
      class="title"
      :style="{color:statusColor(reportDetail?.status!)}"
      style="display: flex; justify-content: center; align-items: center; margin-top: 8px"
    >
      <div>{{ statusFormatter(reportDetail?.status!) }}</div>
    </div>
    <view style="display: flex; flex-direction: row; justify-content: center; margin-top: 4px">
      <view class="message">
        <image src="../../../static/report-time.svg" class="icon"></image>
        <view style="font-size: 23rpx; margin-top: 14rpx; margin-left: 6rpx">
          {{ dateTimeFormatter(reportDetail?.createTime!) }}
        </view></view
      >
      <view v-if="reportDetail?.relatedPile" class="message">
        <image src="../../../static/report-location.svg" class="icon2"></image>
        <view style="font-size: 23rpx; margin-top: 14rpx; margin-left: 6rpx">
          {{ reportDetail.relatedPile.pileName + ' 充电桩 ' + reportDetail.relatedPile?.stationName }}
        </view>
      </view></view
    >

    <view class="content">
      <view class="small-title"> 举报原因 </view>
      <view class="words">
        {{ reportDetail?.title }}
      </view>

      <view class="small-title"> 举报描述 </view>
      <view class="words">
        {{ reportDetail?.content }}
      </view>

      <view class="small-title"> 举报图片 </view>
      <image
        v-for="(photoUrl, index) in reportDetail?.photoUrlList"
        :key="index"
        :src="photoUrl"
        mode="widthFix"
        class="picture words"
      ></image>

      <template v-if="reportDetail?.status === 'Committed'">
        <div v-if="reportDetail.relatedChargeHistory" style="display: flex; flex-direction: column">
          <view class="small-title"> 相关联的充电记录 </view>
          <div
            style="
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); /* 添加阴影效果 */
              padding: 10px;
              width: 80%;
              align-self: center;
            "
          >
            <view class="header">
              <view>
                <view class="title"
                  >{{ reportDetail.relatedChargeHistory.stationName }}
                  {{ reportDetail.relatedChargeHistory.pileName }}</view
                >
                <view class="create-time">{{
                  dateTimeFormatter(new Date(reportDetail.relatedChargeHistory.begin))
                }}</view>
              </view>
              <view>
                <view
                  class="status"
                  :style="{
                    color: reportDetail.relatedChargeHistory.status === 'Using' ? '#056334' : 'rgba(0, 0, 0, 0.4)',
                  }"
                >
                  {{ statusFormatter(reportDetail.relatedChargeHistory.status) }}
                </view>
              </view>
            </view>
            <view class="detail">
              <view class="left">
                <template v-if="reportDetail.relatedChargeHistory.status !== 'Using'">
                  <view>
                    <image
                      :src="reportDetail.relatedChargeHistory.endPhotoUrl"
                      @click="previewPhoto(reportDetail?.relatedChargeHistory?.endPhotoUrl!)"
                    ></image>
                    <image
                      :src="reportDetail.relatedChargeHistory.movePhotoUrl"
                      @click="previewPhoto(reportDetail?.relatedChargeHistory?.movePhotoUrl!)"
                    ></image>
                  </view>
                  <text class="note-title">移车备注</text>
                  <text class="note">{{
                    reportDetail.relatedChargeHistory.moveDesc
                      ? reportDetail.relatedChargeHistory.moveDesc
                      : '无移车备注'
                  }}</text>
                </template>
                <view v-else class="using">
                  <text class="note">暂无详细信息</text>
                  <!-- <button @click="finishCharging(reportDetail.relatedChargeHistory.scooterCode)">提前结束</button> -->
                </view>
              </view>
              <view class="right">
                <view>
                  <text class="name">{{ reportDetail.relatedChargeHistory.scooterCode }}</text>
                  <text v-if="reportDetail.relatedChargeHistory.end" class="charge-status"
                    >结束时间{{ dateTimeFormatter(new Date(reportDetail.relatedChargeHistory.end)) }}</text
                  >
                  <text v-else class="charge-status"
                    >本次充满需要{{ reportDetail.relatedChargeHistory.expectHour }}小时</text
                  >
                </view>
              </view>
            </view>
          </div>
        </div>

        <view class="words buttons">
          <view class="reject-button" @click="handleReportStatusChange(false)"> 驳回 </view>
          <view class="pass-button" @click="handleReportStatusChange(true)"> 通过 </view>
        </view>
      </template>

      <template v-if="reportDetail?.status === 'Rejected' || reportDetail?.status === 'Solved'">
        <view class="small-title"> 处理结果 </view>
        <view
          :class="{ pass: reportDetail?.status === 'Solved', reject: !(reportDetail?.status === 'Rejected') }"
          class="words"
          >{{ reportDetail.solvedReply }}</view
        >
        <view class="small-title"> 处理时间 </view>
        <view
          :class="{ pass: reportDetail?.status === 'Solved', reject: !(reportDetail?.status === 'Rejected') }"
          class="words"
          >{{ dateTimeFormatter(reportDetail.solvedTime!) }}</view
        >
      </template>
      <div
        v-if="reportDetail?.relatedChargeHistory"
        style="margin: 50rpx 50rpx 0 50rpx; display: flex; flex-direction: column; gap: 16px"
      >
        <add-black-list-bottom :scooter-code="reportDetail?.relatedChargeHistory?.scooterCode"
          >将相关充电记录的充电者加入黑名单</add-black-list-bottom
        ><add-black-list-bottom :user-id="reportDetail?.relatedChargeHistory?.endUserId"
          >将相关充电记录的结束者加入黑名单</add-black-list-bottom
        >
      </div>
      <button v-if="!isShowAddBlackListWithType" style="margin: 16px 50rpx 0 50rpx" type="warn" @click="showType">
        将车辆加入黑名单
      </button>

      <add-black-list-with-type
        v-if="!(reportDetail?.status === 'Created' || reportDetail?.status === 'None') && isShowAddBlackListWithType"
        id="type"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app';
import api from '@/api';
import { ReportItemVO, reportStatus } from '@/api/report';
import { getCurrentInstance, ref } from 'vue';
import AddBlackListWithType from '@/pages/components/addBlackListWithType/addBlackListWithType.vue';
import addBlackListBottom from '@/pages/components/addBlackListBottom/addBlackListBottom.vue';
import { dateTimeFormatter, timeFormatter } from '@/utils/timeformatter';

const previewPhoto = (url: string) => {
  if (url === '' || url === null) {
    return;
  }
  uni.previewImage({
    urls: [url],
  });
};

// 日期格式
// Date.prototype.toMyDateString2 = function () {
//   return this.getMonth() + 1 + '月' + this.getDate() + '日' + ' ' + this.getHours() + ':' + this.getMinutes();
// };
onShow(() => {
  const instance = getCurrentInstance()?.proxy;
  const eventChannel = instance.getOpenerEventChannel();
  eventChannel.once('reportData', (data: { data: ReportItemVO }) => {
    reportDetail.value = data.data;
    console.log(reportDetail.value);
  });
});
const reportDetail = ref<ReportItemVO>();

const statusColor = (status: string) => {
  switch (status) {
    case 'Created':
      return 'red';
    case 'Committed':
      return 'orange';
    case 'Rejected':
      return 'red';
    case 'Solved':
      return 'green';
    default:
      return 'black';
  }
};

const statusFormatter = (status: string) => {
  switch (status) {
    case 'Created':
      return '已创建';
    case 'Committed':
      return '已提交';
    case 'Rejected':
      return '已驳回';
    case 'Solved':
      return '已处理';
    default:
      return '未知状态';
  }
};

const subscribeId = 'PXbaC2t1IAQ8ILtPPre-iz3Nz2-F6kIGqJDn868o1_o';
const isShowAddBlackListWithType = ref(false);
const showType = () => {
  isShowAddBlackListWithType.value = !isShowAddBlackListWithType.value;
  // uni.pageScrollTo({
  //   selector: '#type',
  //   success: (res) => {
  //     console.log('🚀 ~ file: reportDetail.vue:171 ~ showType ~ res:', res);
  //   },
  //   fail: (err) => {
  //     console.log('🚀 ~ file: reportDetail.vue:176 ~ showType ~ err:', err);
  //   },
  // });
};

const handleReportStatusChange = (pass: boolean) => {
  uni.showModal({
    title: pass ? '通过此举报' : '驳回此举报',
    editable: true,
    placeholderText: '请输入处理理由',
    showCancel: true,
    success: ({ confirm, cancel, content }) => {
      if (cancel) {
        return;
      } else if (!content) {
        uni.showToast({
          title: '请输入处理理由',
          icon: 'error',
          duration: 2000,
        });
      } else if (confirm) {
        if (!reportDetail.value?.id) {
          return;
        }
        api
          .changeReportStatus(reportDetail.value?.id, pass ? 1 : 2, content)
          .then(() => {
            reportDetail.value = {
              ...reportDetail.value,
              status: pass ? reportStatus.Solved : reportStatus.Rejected,
              solvedReply: content,
              solvedTime: new Date(),
            };
            uni.showToast({
              title: '通过成功',
              icon: 'success',
              duration: 2000,
            });
            uni.requestSubscribeMessage({
              tmplIds: ['PXbaC2t1IAQ8ILtPPre-iz3Nz2-F6kIGqJDn868o1_o'],
              success: (res) => {
                if (res.errMsg !== 'requestSubscribeMessage:ok' && res[subscribeId] !== 'accept') {
                  uni.showToast({
                    title: '不订阅无法收到通知',
                    icon: 'none',
                  });
                  return;
                }
              },
            });
          })
          .catch((err) => {
            uni.showToast({
              title: err.message,
              icon: 'none',
            });
          });
      }
    },
  });
};
</script>

<style scoped lang="less">
.message {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 56rpx;
  font-weight: bold;
}
.icon {
  width: 54rpx;
  height: 54rpx;
}

.icon2 {
  width: 40rpx;
  height: 40rpx;
  margin-top: 10rpx;
}

.small-title {
  font-size: 35rpx;
  margin-left: 50rpx;
  margin-top: 28rpx;
}

.words {
  font-size: 25rpx;
  margin-left: 160rpx;
  margin-right: 160rpx;
  margin-top: 22rpx;
}

.picture {
  width: 400rpx;
  background-color: gray;
  border-radius: 30rpx;
}
.history {
  height: 110rpx;
  overflow-y: hidden;
}

.reject-button {
  height: 47rpx;
  width: 215rpx;
  background-color: #dadada;
  border-top-left-radius: 45rpx;
  border-bottom-left-radius: 45rpx;
  border: 4rpx solid #6f6f6f;
  line-height: 45rpx;
  color: #aa0000;
}

.pass-button {
  height: 47rpx;
  width: 215rpx;
  background-color: #89aa8e;
  border-top-right-radius: 45rpx;
  border-bottom-right-radius: 45rpx;
  border-right: 4rpx solid #6f6f6f;
  border-top: 4rpx solid #6f6f6f;
  border-bottom: 4rpx solid #6f6f6f;
  line-height: 45rpx;
  color: #e7e7e7;
}

.buttons {
  display: flex;
  text-align: center;
  font-size: 28rpx;
  margin-top: 100rpx;
}

.pass {
  color: #005500;
}

.reject {
  color: #aa0000;
}

/* chargeHistory css */
.content {
  width: auto;
  background-color: white;
  margin-top: 12px;
}

.header {
  padding: 10px 14px;
  border-bottom: 1px solid #d8d8d8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  display: block;
  color: rgba(0, 0, 0, 0.9);
}

.create-time {
  display: block;
  font-size: 12px;
  color: #9e9e9e;
}

.status {
  display: block;
  font-size: 12px;
}

.detail {
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
}

.left {
  image {
    margin-right: 6px;
    width: 50px;
    height: 50px;
  }

  .note-title {
    margin-top: 35rpx;
    color: #1a1a1a;
    font-size: 12px;
    display: block;
  }

  .note {
    font-size: 12px;
    color: #9e9e9e;
  }

  .using {
    display: flex;
    flex-direction: column;
    height: 100%;

    button {
      color: #b11f26;
      font-size: 12px;
      padding: 4px 6px;
      border: 1px solid #b11f26;
      line-height: 12px;
      margin: 0;
      border-radius: 2px;
    }

    .note {
      display: block;
      flex: 1;
    }
  }
}

.right {
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .name {
    display: block;
    font-size: 24px;
    color: #1a1a1a;
    font-weight: bold;
  }

  .charge-status {
    font-family: SourceHanSansCN-Regular;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }
}

.problem {
  margin-top: 30rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  text {
    font-family: SourceHanSansCN-Regular;
    font-size: 13px;
    color: #3d3d3d;
  }

  image {
    width: 16px;
    height: 16px;
  }
}
</style>
