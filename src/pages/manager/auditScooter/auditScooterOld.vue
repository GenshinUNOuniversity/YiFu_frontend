<!--
 * @Author: Little_WeakDuck
 * @Date: 2023-10-10 00:17:48
 * @LastEditors: Little_WeakDuck
 * @LastEditTime: 2023-10-10 00:17:50
 * @FilePath: /src/pages/manager/auditScooter/auditScooter copy.vue
 * @Description: 
-->
<template>
  <view class="title">审核用户</view>
  <view>
    <view class="scooter_code_input_ctn">
      <input
        v-model="userId"
        type="number"
        class="scooter_code_input"
        placeholder="请输入通过的用户ID"
        placeholder-class="input-placeholder"
        @input="handleInputChange"
      />
      <view style="display: flex; flex-direction: row; gap: 8px"
        ><button class="button" type="primary" @click="giveUserAccess">审核通过</button>
      </view></view
    >
    <view v-if="userInfo" class="user-info">
      <view class="info-item">
        <view class="item-label">姓名：</view>
        <view class="item-value">{{ userInfo?.realName }}</view>
      </view>
      <view class="info-item">
        <view class="item-label">学院：</view>
        <view class="item-value">{{ userInfo?.faculty }}</view>
      </view>
      <view class="info-item">
        <view class="item-label">学号：</view>
        <view class="item-value">{{ userInfo?.studentId }}</view>
      </view>
      <view class="info-item">
        <view class="item-label">手机号：</view>
        <view class="item-value">{{ userInfo?.phone }}</view>
      </view>
    </view>
  </view>
  <view class="title">审核电动车</view>
  <view class="scooter_code_input_ctn">
    <input
      v-model="scooterCode"
      class="scooter_code_input"
      placeholder="请输入电动车编号"
      placeholder-class="input-placeholder"
    />
    <view style="display: flex; flex-direction: row; gap: 8px"
      ><button class="button" type="primary" @click="auditScooter(scooterCode, true, ScooterStatus.Auditing)">
        通过
      </button>
      <button class="button" type="warn" @click="auditScooter(scooterCode, false, ScooterStatus.Auditing)">拒绝</button>
    </view>
  </view>
  <div style="display: flex; align-items: center; justify-content: center">
    <checkbox-group @change="handleSelectChange">
      <label> <checkbox value="Auditing" :checked="true" />待审核 </label>
      <label> <checkbox value="Normal" />已通过 </label>
      <label> <checkbox value="Reject" />未通过 </label>
    </checkbox-group>
  </div>
  <view class="container">
    <template v-for="scooter in showScooterList" :key="scooter.scooterId">
      <view class="contain-box">
        <view style="display: flex; flex-direction: column">
          <view> 编号：{{ scooter.code }} </view>
          <view style="margin-top: 15rpx"> 期望充满时间：{{ scooter.expectHour }} </view>
          <view style="margin-top: 15rpx"> 满电描述：{{ scooter.completeDesc }} </view>
        </view>
        <view style="display: flex; flex-direction: column; justify-content: space-between">
          <icon
            v-if="scooter.status === 'Normal' || scooter.status === 'Auditing'"
            type="success"
            size="100rpx"
            @click="auditScooter(scooter.code, true, scooter.status)"
          ></icon>
          <icon
            v-if="scooter.status === 'Rejected' || scooter.status === 'Auditing'"
            type="cancel"
            size="100rpx"
            @click="auditScooter(scooter.code, false, scooter.status)"
          ></icon>
        </view>
      </view>
    </template>

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

<script lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import api from '@/api';
import { ref, watch } from 'vue';
import { ScooterVO, ScooterStatus } from '@/api/scooter';
import { UserProfileInfoVO } from '@/api/user';
import user from '@/api/user';
export default {
  name: 'Blacklist',
  setup() {
    onLoad(() => {
      uni.getSetting({
        withSubscriptions: true,
        // success: ({ subscriptionsSetting }) => {},
      });
      // TODO: 以后加触底加载
      api.getAllScooter(1, 100).then((res) => {
        scooterList.value = res.data.data;
      });
    });
    const scooterList = ref<ScooterVO[]>([]);
    const showScooterList = ref<ScooterVO[]>([]);
    const selectItems = ref<string[]>(['Auditing']);
    const scooterCode = ref('');
    const userId = ref<number>();
    const userInfo = ref<UserProfileInfoVO>();

    watch(userId, (userId) => {
      if (userId! < 1 || userId === undefined) {
        return;
      }
      api
        .managerGetUserInfo(userId)
        .then((res) => {
          userInfo.value = res.data;
        })
        .catch(() => {
          userInfo.value = undefined;
        });
    });

    const handleSelectChange = ({ detail: { value } }) => {
      selectItems.value = value;
    };

    watch([scooterList, selectItems], ([scooterList, selectItems]) => {
      showScooterList.value = scooterList.filter((scooter) => selectItems.includes(scooter.status));
    });

    const giveUserAccess = () => {
      if (userId.value === undefined) {
        uni.showToast({
          title: '请输入用户ID',
          icon: 'none',
          duration: 2000,
        });
        return;
      }
      api.giveUserAccess(userId.value).then((res) => {
        uni.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000,
        });
      });
    };

    function auditScooter(code: string, agree: boolean, status: ScooterStatus) {
      if (status !== 'Auditing') {
        return;
      }
      uni.showModal({
        title: agree ? '通过' : '拒绝',
        content: `确定要${agree ? '通过' : '拒绝' + code}吗`,
        success: function (res) {
          if (res.confirm) {
            api
              .auditScooter(code, agree)
              .then((res) => {
                uni.showToast({
                  title: agree ? '通过成功' : '拒绝成功',
                  icon: agree ? 'success' : 'error',
                  duration: 2000,
                });
                scooterCode.value = '';
                api.getAllScooter(1, 100).then((res) => {
                  scooterList.value = res.data.data;
                });
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

    return {
      showScooterList,
      ScooterStatus,
      scooterCode,
      userId,
      userInfo,
      auditScooter,
      handleSelectChange,
      giveUserAccess,
    };
  },
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
  align-items: center;
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
