<template>
  <view class="title">审核用户&电动车</view>
  <view>
    <view class="scooter_code_input_ctn">
      <input
        v-model="scooterCode"
        style="width: 100%; margin: 0 8px"
        class="scooter_code_input"
        placeholder="请输入编号"
        placeholder-class="input-placeholder"
      />
    </view>
  </view>
  <view class="container">
    <view v-if="userInfo" class="contain-box search-box">
      <view
        style="display: flex; flex-direction: row; justify-content: space-between; width: 100%"
        @click="toAuditDetail(scooterCode)"
      >
        <view class="container-header">{{ scooterCode }}号电动车</view>
        <view> > </view>
      </view>
    </view>
    <view class="contain-title">待审核电动车</view>
    <view v-for="scooter in auditScooterList" :key="scooter.scooterId" class="contain-box">
      <view
        style="display: flex; flex-direction: row; justify-content: space-between; width: 100%"
        @click="toAuditDetail(scooter.code)"
      >
        <view class="container-header">{{ scooter.code }}号电动车</view>
        <view> > </view>
      </view>
    </view>
    <Bottom-loading-prompt
      :has-more="hasMoreAuditScooterList"
      :is-loading="isLoadingAuditScooterList"
      :no-data="!(isLoadingAuditScooterList || auditScooterList.length !== 0)"
    />
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import api from '@/api';
import { ref, watch } from 'vue';
import BottomLoadingPrompt from '@/pages/components/bottomLoadingPrompt/bottomLoadingPrompt.vue';
import { AuditScooterUserInfoVO, ScooterVO } from '@/api/scooter';
onLoad(() => {
  uni.getSetting({
    withSubscriptions: true,
    // success: ({ subscriptionsSetting }) => {},
  });
  getAuditScooterList();
});
const scooterCode = ref('');
const userInfo = ref<AuditScooterUserInfoVO>();
const auditScooterListPageNum = ref(1);
const hasMoreAuditScooterList = ref(true);
const isLoadingAuditScooterList = ref(false);
const auditScooterList = ref<ScooterVO[]>([]);
const getAuditScooterList = async () => {
  isLoadingAuditScooterList.value = true;
  api
    .managerGetAuditScooterList({ pageNum: auditScooterListPageNum.value, pageSize: 5 })
    .then((res) => {
      auditScooterList.value = auditScooterList.value.concat(res.data.data);
      if (auditScooterListPageNum.value * 5 >= res.data.total) {
        hasMoreAuditScooterList.value = false;
      } else {
        auditScooterListPageNum.value += 1;
      }
      uni.hideLoading();
    })
    .catch(() => {
      uni.hideLoading();
      uni.showToast({
        title: '获取待审核电动车失败',
        icon: 'none',
      });
    })
    .finally(() => {
      isLoadingAuditScooterList.value = false;
    });
};

onPullDownRefresh(async () => {
  uni.showLoading({
    title: '加载中',
  });
  auditScooterList.value = [];
  hasMoreAuditScooterList.value = true;
  auditScooterListPageNum.value = 1;
  await getAuditScooterList();
  uni.hideLoading();
});

onReachBottom(async () => {
  if (hasMoreAuditScooterList.value && !isLoadingAuditScooterList.value) {
    await getAuditScooterList();
  }
});

const scooterCodeReg = /^[A-Z]?\d{1,4}$/;

watch(scooterCode, (scooterCode) => {
  if (!scooterCodeReg.test(scooterCode) || scooterCode === undefined) {
    return;
  }
  userInfo.value = undefined;
  api
    .managerGetUserInfoByScooterCode(scooterCode)
    .then((res) => {
      userInfo.value = res.data;
    })
    .catch(() => {
      userInfo.value = undefined;
    });
});

const toAuditDetail = (code: string) => {
  uni.navigateTo({
    url: `/pages/manager/auditScooter/scooterDetail?scooterCode=${code}`,
  });
};
</script>

<style scoped>
.user-info {
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, 0.1);
  padding: 16px;
  align-self: stretch;
}
.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.item-label {
  font-size: 28rpx;
  color: #999;
  margin-right: 10rpx;
  width: 200rpx;
  text-align: right;
}
.item-value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}
.title {
  text-align: center;
  font-size: 50rpx;
  margin-top: 64rpx;
  margin-bottom: 50rpx;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.contain-box {
  background-color: rgba(230, 230, 230);
  box-shadow: 0px 5px 20px 0px rgba(161, 161, 161);
  padding: 32rpx;
  margin-top: 20rpx;
  width: 80%;
  border-radius: 30rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.search-box {
  margin-bottom: 20rpx;
}

.contain-title {
  font-size: 40rpx;
  padding-left: 50rpx;
  font-weight: bold;
  align-self: start;
}
.container-header {
  font-size: 18px;
  font-weight: bold;
}

.inputCode {
  margin-top: 20rpx;
  border: 2px solid #686868;
  border-radius: 12px;
  height: 80rpx;
  padding-left: 40rpx;
  padding-right: 40rpx;
}

.scooter_code_input_ctn {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-around;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 16px;
}

.scooter_code_input {
  flex-shrink: 1;
  padding: 16px;
  background-color: #fff;
  border-radius: 16px;
}
</style>
