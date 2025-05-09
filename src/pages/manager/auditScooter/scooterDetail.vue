<!--
 * @Author: Little Weak_Duck
 * @Date: 2023-11-27 19:41:06
 * @LastEditors: Little Weak_Duck
 * @LastEditTime: 2023-11-27 20:11:02
 * @FilePath: /src/pages/manager/auditScooter/scooterDetail.vue
 * @Description: 
-->
<template>
  <view class="title">{{ scooterCode }}号电动车</view>
  <view class="container">
    <view v-if="userInfo" class="contain-box">
      <view style="display: flex; flex-direction: column">
        <view class="container-header">用户信息</view>
        <view> 姓名：{{ userInfo?.realName }} </view>
        <view style="margin-top: 15rpx"> 学院：{{ userInfo.faculty }} </view>
        <view style="margin-top: 15rpx"> 学号：{{ userInfo?.studentId }} </view>
        <view style="margin-top: 15rpx"> 手机号：{{ userInfo?.phone }} </view>
      </view>
    </view>
    <view v-for="(scooter, index) in historyScooterList" :key="index" class="contain-box">
      <view style="display: flex; flex-direction: column">
        <view class="container-header">电动车信息</view>
        <view> 编号：{{ scooter.code }} </view>
        <view> 电动车状态：{{ scooterStatusFormatter(scooter.status) }}</view>
      </view>
    </view>
    <view
      v-if="userInfo"
      style="display: flex; flex-direction: row; justify-content: space-between; width: 80%; margin-top: 32px"
    >
      <button style="margin: 0px" type="warn" @click="auditScooter(scooterCode, false)">拒绝</button>
      <button style="margin: 0px" type="primary" @click="auditScooter(scooterCode, true)">通过</button>
    </view>

    <!-- <button type="primary" class="addBtn" @click="showAdd = true">添加</button>

    <modal
      v-if="showAdd"
      confirm-text="添加"
      cancel-text="取消"
      @cancel="
        showAdd = false;
        addInfo.code = '';
      "
      @confirm="confirmAdd"
    >
      <view style="font-size: 38rpx; font-weight: bold; color: firebrick"> 将该车列入黑名单 </view>
      <input v-model="addInfo.code" type="text" placeholder="车辆编码" maxlength="10" class="inputCode" />
    </modal> -->
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import api from '@/api';
import { ref, watch } from 'vue';
import { AuditScooterUserInfoVO, ScooterBindHistoryVO, Status } from '@/api/scooter';
// import { Role } from '@/api/user';

const historyScooterList = ref<ScooterBindHistoryVO[]>([]);
const scooterCode = ref('');
const userId = ref<number>();
const userInfo = ref<AuditScooterUserInfoVO>();

onLoad(async (option) => {
  if (option && option.scooterCode) {
    scooterCode.value = option.scooterCode;
  } else {
    uni.showModal({
      title: '提示',
      content: '请先输入电动车编号',
      showCancel: false,
      success: () => {
        uni.navigateBack();
      },
    });
  }
  try {
    uni.showLoading({
      title: '加载中',
    });
    const userInfoRes = await api.managerGetUserInfoByScooterCode(scooterCode.value);
    userInfo.value = userInfoRes.data;
    if (!userInfo.value.newUser) {
      const userHistoryRes = await api.managerGetUserHistoryScooter({ userId: userInfo.value.userId });
      historyScooterList.value = userHistoryRes.data.data;
    }
    uni.hideLoading();
  } catch (error) {
    console.error('🚀 ~ file: scooterDetail.vue:100 ~ onLoad ~ error:', error);
    uni.showModal({
      title: '提示',
      content: '获取用户信息失败',
      showCancel: false,
      success: () => {
        uni.navigateBack();
      },
    });
  }
});

const passNewUser = async () => {
  if (!userInfo.value) {
    return;
  }
  try {
    await api.giveUserAccess(userInfo.value.userId, Role.User);
  } catch (error) {
    uni.showToast({
      title: error.data.message,
      icon: 'error',
      duration: 2000,
    });
    throw new Error(error);
  }
};

function auditScooter(code: string, agree: boolean) {
  uni.showModal({
    title: agree ? '通过' : '拒绝',
    content: `确定要${agree ? '通过' : '拒绝' + code}吗`,
    success: async function (res) {
      if (res.confirm) {
        if (userInfo.value?.newUser) {
          await passNewUser();
        }
        api
          .auditScooter(code, agree)
          .then((res) => {
            uni.showToast({
              title: agree ? '通过成功' : '拒绝成功',
              icon: agree ? 'success' : 'error',
              duration: 2000,
            });
            scooterCode.value = '';
            userInfo.value = undefined;
          })
          .catch((err) => {
            uni.showToast({
              title: agree ? '通过失败' : '拒绝失败',
              icon: 'none',
              duration: 2000,
            });
          });
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
}

const scooterStatusFormatter = (status: Status) => {
  switch (status) {
    case 'Normal':
      return '正常';
    case 'Auditing':
      return '审核中';
    case 'Rejected':
      return '已拒绝';
    case 'Deleted':
      return '已删除';
    default:
      return '状态未知';
  }
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
  margin-top: 40rpx;
  width: 80%;
  border-radius: 30rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.container-header {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: bold;
}

.delete {
  width: 100rpx;
  height: 100rpx;
}

.addBtn {
  margin-top: 60rpx;
  width: 80%;
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

.bottom {
  flex-shrink: 0;
}
</style>
