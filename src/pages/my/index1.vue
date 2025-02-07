<template>
  <view class="pic" style="z-index: -99999"></view>
  <div style="height: 150px" />
  <view class="text-area">
    <view v-if="isLogin" class="account">
      <image class="profile-pic" :src="userInfo?.info.avatarUrl || '../../static/avatar.png'" />
      <view>
        <text class="accountName">{{ userInfo?.info.nickname }}</text>
        <text class="schoolName">{{ userInfo?.info.faculty || '学院信息异常' }}</text>
      </view>
    </view>
    <view v-else class="account">
      <image class="profile-pic" :src="userInfo?.info.avatarUrl" />
      <view>
        <text class="accountName" @click="login">点击登录</text>
      </view>
    </view>

    <view class="detail-info">
      <view>
        <template v-if="auditingScooters.length > 0">
          <view class="isBonded">待审核的电动车</view>
          <view class="vehicleName">{{ auditingScooters[0].code }}</view>
          <view class="chargeDesc">{{
            auditingScooters[0].expectHour + '小时充满 ' + auditingScooters[0].completeDesc
          }}</view>
        </template>
        <template v-if="normalScooters.length > 0">
          <view class="isBonded">已绑定的电动车</view>
          <view class="vehicleName">{{ normalScooters[0].code }}</view>
          <view class="chargeDesc">{{
            normalScooters[0].expectHour + '小时充满 ' + normalScooters[0].completeDesc
          }}</view>
        </template>
        <template v-if="rejectedScooters.length > 0">
          <view class="isBonded">被拒绝的电动车</view>
          <view class="vehicleName">{{ rejectedScooters[0].code }}</view>
        </template>
        <template v-if="auditingScooters.length === 0 && normalScooters.length === 0">
          <view class="isBonded">{{
            rejectedScooters.length > 0 ? '电动车被拒绝请重新添加电动车' : '还未添加电动车'
          }}</view>
        </template>
      </view>
      <view class="edit" @click="editScooter">
        <text class="editText">编辑</text>
        <image class="editIcon" src="/static/chevron-right.svg" />
      </view>
    </view>
  </view>
  <view class="other-area">
    <text class="other-text">其它服务</text>
    <view class="other-grid">
      <navigator hover-class="none" url="../report/reportHistory/index">
        <view class="item">
          <image src="/static/report-history.svg" />
          <text>举报历史</text>
        </view>
      </navigator>
      <!-- <navigator hover-class="none">
        <view class="item">
          <image src="/static/feedback.svg" />
          <text>反馈</text>
        </view>
      </navigator> -->
      <navigator hover-class="none" url="../charging/chargeHistory/index">
        <view class="item">
          <image src="/static/charge.svg" />
          <text>充电历史</text>
        </view>
      </navigator>
      <navigator
        v-if="userInfo?.role === 'Manager' || userInfo?.role === 'Admin'"
        hover-class="none"
        url="../manager/index"
      >
        <view class="item">
          <image src="/static/manage.svg" />
          <text>充电站管理</text>
        </view>
      </navigator>
      <navigator v-if="status === 'None'" hover-class="none" url="../components/userProfile/userProfile">
        <view class="item">
          <image src="/static/charge.svg" />
          <text>个人信息更改</text>
        </view>
      </navigator>
      <navigator v-else hover-class="none" url="./phoneManage/phoneManage">
        <view class="item">
          <image src="/static/personInfo.svg" />
          <text>帐号管理</text>
        </view>
      </navigator>
      <view class="item" @click="logout">
        <image src="/static/manage.svg" />
        <text>清空缓存</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import api from '@/api';
import { Role, UserProfileVO } from '@/api/user';
import { ScooterVO } from '@/api/scooter';
import { useTrack } from '@/business/track/useTrack';
// import { findFacultyIndex } from '@/utils/faculty';

const trackService = useTrack();

export default {
  name: 'Index',
  setup() {
    const status = ref<Role>(uni.getStorageSync('status') || 'None');
    const userInfo = ref<UserProfileVO>();
    const normalScooters = ref<ScooterVO[]>([]);
    const auditingScooters = ref<ScooterVO[]>([]);
    const rejectedScooters = ref<ScooterVO[]>([]);

    const isLogin = ref(!(uni.getStorageSync('auth') === ''));

    const login = async () => {
      try {
        await api.login();
        isLogin.value = true;
        onShowFun();
      } catch (error) {
        uni.showToast({
          title: '登录失败',
          icon: 'error',
        });
      }
    };

    const onShowFun = async () => {
      await api.getUserInfo().then((res) => {
        userInfo.value = res.data;
        status.value = userInfo.value.role;
        if (res.data.extend.manager?.stationId) {
          uni.setStorage({
            key: 'stationId',
            data: res.data.extend.manager.stationId,
          });
        }
      });

      api
        .getUserScooterList({
          pageNum: 1,
          pageSize: 100,
        })
        .then((res) => {
          normalScooters.value = res.data.data.filter((scooter) => {
            return scooter.status === 'Normal';
          });
          auditingScooters.value = res.data.data.filter((scooter) => {
            return scooter.status === 'Auditing';
          });
          rejectedScooters.value = res.data.data.filter((scooter) => {
            return scooter.status === 'Rejected';
          });
        });

      trackService.doTrack({
        pgid: trackService.PageId.My,
        eid: '',
        eventId: trackService.EventId.IMPL,
      });
    };
    onShow(() => {
      onShowFun();
    });

    const editScooter = () => {
      if (normalScooters.value.length > 0) {
        uni.navigateTo({
          url: `/pages/my/edit/edit?haveScooter=true&scooterId=${normalScooters.value[0].scooterId}&code=${normalScooters.value[0].code}&checked=true`,
        });
      } else if (auditingScooters.value.length > 0) {
        uni.navigateTo({
          url: `/pages/my/edit/edit?haveScooter=true&scooterId=${auditingScooters.value[0].scooterId}&code=${auditingScooters.value[0].code}`,
        });
      } else if (rejectedScooters.value.length > 0) {
        uni.navigateTo({
          url: `/pages/my/edit/edit?haveScooter=true&scooterId=${rejectedScooters.value[0].scooterId}&code=${rejectedScooters.value[0].code}&reject=true`,
        });
      } else {
        uni.navigateTo({
          url: `/pages/my/edit/edit?haveScooter=false`,
        });
      }
    };

    const logout = () => {
      uni.showActionSheet({
        itemList: ['清空缓存'],
        success: (res) => {
          if (res.tapIndex === 0) {
            uni.clearStorageSync();
            uni.reLaunch({
              url: '/pages/charging/index',
            });
          }
        },
      });
    };

    return {
      status,
      userInfo,
      normalScooters,
      auditingScooters,
      rejectedScooters,
      editScooter,
      logout,
      isLogin,
      login,
    };
  },
};
</script>

<style scoped lang="less">
.pic {
  position: absolute;
  width: 100%;
  height: 195px;
  background-repeat: no-repeat;
  background-size: 100%;
}
.view-pic {
  width: 100%;
  height: 195px;
}

.profile-pic {
  height: 64px;
  width: 64px;
  border-radius: 100%;
  float: left;
}

.text-area {
  margin: 0 30rpx;
  padding: 30rpx;
  background: #ffffff;
}

.account {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30rpx;
  margin-bottom: 40rpx;
}

.accountName {
  display: block;
  font-family: SourceHanSansCN-Bold;
  font-size: 24px;
  font-weight: bold;
  color: #3d3d3d;
}

.schoolName {
  display: block;
  font-family: SourceHanSansCN-Regular;
  font-size: 12px;
  font-weight: normal;

  color: rgba(0, 0, 0, 0.4);
}

.detail-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.isBonded {
  font-family: SourceHanSansCN-Regular;
  font-size: 16px;
  font-weight: normal;
  white-space: pre;
  color: #3d3d3d;
}
.vehicleName {
  font-family: SourceHanSansCN-Medium;
  font-size: 20px;
  color: #3d3d3d;
}
.chargeDesc {
  font-family: SourceHanSansCN-Regular;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
}

.edit {
  display: flex;
  align-items: center;
}

.editText {
  font-family: SourceHanSansCN-Regular;
  font-size: 13px;
  color: #3d3d3d;
}
.editIcon {
  width: 16px;
  height: 16px;
}

.other-area {
  margin: 21px 30rpx 0;
  background: #ffffff;
  padding: 30rpx;
}

.other-text {
  font-family: SourceHanSansCN-Bold;
  font-size: 16px;
  font-weight: bold;
  color: #3d3d3d;
}

.other-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  .item {
    font-family: SourceHanSansCN-Regular;
    font-size: 12px;
    text-align: center;
    color: #3d3d3d;
    margin-top: 30rpx;

    image {
      display: block;
      margin: 0 auto 20rpx;
      width: 25px;
      height: 25px;
    }
  }
}
</style>
