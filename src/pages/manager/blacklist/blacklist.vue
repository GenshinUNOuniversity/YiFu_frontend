<template>
  <view class="title">黑名单</view>
  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
    <checkbox-group
      class="contain-box"
      style="
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: sticky;
        top: 16px;
        margin: 16px;
        padding: 8px 32rpx 8px 32rpx;
      "
      @change="handleSelectChange"
    >
      <label> <checkbox value="Normal" :checked="true" />正在黑名单中 </label>
      <label> <checkbox value="Cancelled" />已结束或删除黑名单 </label>
    </checkbox-group>
    <add-black-list-bottom style="align-self: center; width: 80%; border-radius: 30rpx" :scooter-code="true"
      >添加黑名单</add-black-list-bottom
    >
  </div>
  <view class="container">
    <template v-for="black in showBlacklist" :key="black.blackListHistoryId">
      <view class="contain-box">
        <view style="display: flex; flex-direction: column">
          <view style="display: flex; flex-direction: row; justify-content: space-between">
            <view> {{ black.profile.realName }} </view>
            <view> {{ black.profile.phone }} </view>
          </view>
          <view style="margin-top: 15rpx"> 拉黑时间：{{ dateTimeFormatter(black.createTime) }} </view>
          <view style="margin-top: 15rpx"> 拉黑原因：{{ black.reason }} </view>
          <view style="margin-top: 15rpx"> 解封时间：{{ dateTimeFormatter(black.due) }} </view>
          <image
            src="../../../static/removeBlacklist.png"
            class="delete"
            @click="handleClick(black.blackListHistoryId, black.profile.realName)"
          ></image>
        </view>
      </view>
    </template>
    <!-- 
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
  <Bottom-loading-prompt :has-more="hasMoreBlacklist" :is-loading="isLoadingBlacklist" />
</template>

<script lang="ts" setup>
import { onLoad, onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app';
import api from '@/api';
import { ref, watch } from 'vue';
import { ReportItemVO } from '@/api/report';
import { BlackListHistoryItemVO } from '@/api/blacklist';
import BottomLoadingPrompt from '@/pages/components/bottomLoadingPrompt/bottomLoadingPrompt.vue';
import AddBlackListBottom from '@/pages/components/addBlackListBottom/addBlackListBottom.vue';
import { dateTimeFormatter } from '@/utils/timeformatter';
onLoad(() => {
  //TODO: 自动加载
  getBlackList();
});
const blacklistPageNum = ref(1);
const hasMoreBlacklist = ref(true);
const isLoadingBlacklist = ref(false);
const getBlackList = async () => {
  isLoadingBlacklist.value = true;
  api
    .getBlackList(blacklistPageNum.value, 5)
    .then((res) => {
      blacklist.value = blacklist.value.concat(
        res.data.data.map((black) => {
          black.createTime = new Date(black.createTime);
          return black;
        }),
      );
      if (blacklistPageNum.value * 5 >= res.data.total) {
        hasMoreBlacklist.value = false;
      } else {
        blacklistPageNum.value += 1;
      }
      uni.hideLoading();
    })
    .catch(() => {
      uni.hideLoading();
      uni.showToast({
        title: '获取黑名单失败',
        icon: 'none',
      });
    })
    .finally(() => {
      isLoadingBlacklist.value = false;
    });
};

onPullDownRefresh(async () => {
  uni.showLoading({
    title: '加载中',
  });
  blacklist.value = [];
  hasMoreBlacklist.value = true;
  blacklistPageNum.value = 1;
  await getBlackList();
  uni.hideLoading();
});

const blacklist = ref<BlackListHistoryItemVO[]>([]);
const showBlacklist = ref<BlackListHistoryItemVO[]>([]);
const showAdd = ref(true);
const addInfo = ref({
  code: '',
  time: '',
});

async function handleClick(blackListHistoryId: number, realName: string) {
  uni.showModal({
    title: '删除黑名单',
    content: `确定要将${realName}从黑名单移除吗`,
    success: async function (res) {
      if (res.confirm) {
        await api.deleteBlackList(blackListHistoryId).then(() => {
          uni.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000,
          });
        });
        const page = blacklistPageNum.value;
        blacklistPageNum.value = 1;
        blacklist.value = [];
        for (let index = 0; index < page; index++) {
          await getBlackList();
        }
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
}

function confirmAdd() {
  var newBike = JSON.parse(JSON.stringify(addInfo.value));
  newBike.time = getNowDate();
  blacklist.value?.push(newBike);
  showAdd.value = false;
  addInfo.value.code = '';
}

onReachBottom(async () => {
  if (hasMoreBlacklist.value && !isLoadingBlacklist.value) {
    await getBlackList();
  }
});
const selectItems = ref<'Normal' | 'Cancelled'>('Normal');

const handleSelectChange = ({ detail: { value } }) => {
  selectItems.value = value;
};

watch([blacklist, selectItems], ([newBlacklist, newSelectItems]) => {
  showBlacklist.value = newBlacklist.filter((black) => newSelectItems.includes(black.status));
  if (hasMoreBlacklist.value && !isLoadingBlacklist.value && showBlacklist.value.length < 5) {
    getBlackList();
  }
});
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 50rpx;
  margin-top: 16px;
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
}

.delete {
  width: 100rpx;
  height: 100rpx;
  margin-left: 500rpx;
  margin-top: -100rpx;
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
</style>
