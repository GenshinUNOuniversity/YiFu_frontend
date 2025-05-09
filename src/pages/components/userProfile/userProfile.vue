<template>
  <div class="ctn">
    <div class="titleCtn">
      <image style="height: 102.75px; width: 107.25px; margin-top: 16px" src="/static/info.svg" />
      <p class="write-info">完善个人信息</p>
      <p class="warning-text">请在完善个人信息后找管理员进行审核<br />管理员审核后不可更改，请谨慎填写</p>
    </div>
    <div class="avatar">
      <p>身份</p>
      <radio-group @change="handleRoleChange">
        <radio style="margin-right: 8px" :value="UserType.Student" :checked="role === UserType.Student">学生</radio>
        <radio :value="UserType.Staff" :checked="role === UserType.Staff">教职工</radio>
      </radio-group>
    </div>
    <div class="avatar" style="flex-direction: row; align-item: center">
      <p>头像</p>
      <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
        <p v-if="!avatarUrl" style="font-size: 16px; color: #808080; padding-left: 8px; padding-right: 8px">
          点击选择头像
        </p>
        <div v-else style="height: 40px; width: 40px">
          <div class="mask">更改</div>
          <image style="height: 40px; width: 40px" :src="avatarUrl" mode="scaleToFill" />
        </div>
      </button>
    </div>
    <div class="input">
      <p>姓名</p>
      <input v-model="realName" placeholder="请输入" />
    </div>
    <div class="input">
      <p>昵称</p>
      <input v-model="nickname" type="nickname" placeholder="请输入" />
    </div>
    <ProfilePhoneInput
      v-model:phone="phoneNum"
      v-model:code="code"
      type="profile"
      :success="isChangeSuccess"
      :phone-num="wxPhone"
      @wx-phone-code="getWxPhoneNumber"
      @prefix="handleChangePrefix"
    />
    <div class="input">
      <p>{{ role === 'STUDENT' ? '学号' : '工号' }}</p>
      <input v-model="studentId" type="number" placeholder="请输入" :maxlength="13" />
    </div>
    <div class="input">
      <p>学院</p>
      <picker
        :value="facultyIndex"
        class="selector"
        mode="multiSelector"
        :range="facultyList"
        range-key="name"
        @change="pickerChange"
        @columnchange="pickerColumnChange"
        ><div v-if="facultyIndex[0] !== -1 && facultyList">
          {{ facultyList[1][facultyIndex[1]].name }}
        </div>
        <div v-else style="color: #808080">请选择 ></div>
      </picker>
    </div>
    <button class="submit" @click="updateUserProfile">提交</button>
  </div>
</template>

<script lang="ts" setup>
import api from '@/api';
import { FacultyFatherVO, FacultyItemVO } from '@/api/user';
import { onLoad } from '@dcloudio/uni-app';
import { ref, watch } from 'vue';
import { findFacultyIndex } from '@/utils/faculty';
import { PhonePrefix, checkPhoneReg } from '@/utils/phonePrefix';
import ProfilePhoneInput from '@/pages/components/profilePhoneInput/profilePhoneInput';

onLoad(async () => {
  const { data } = await api.getUserInfo();
  realName.value = data.info.realName;
  nickname.value = data.info.nickname;
  phoneNum.value = data.info.phone;
  studentId.value = data.info.studentId;
  facultyId.value = data.info.facultyId;
  avatarUrl.value = data.info.avatarUrl;
  preAvatarUrl.value = data.info.avatarUrl;
  const { data: bigFacultyListData } = await api.getFacultyList();
  console.log('🚀 ~ file: userProfile.vue:102 ~ onLoad ~ bigFacultyListData:', bigFacultyListData);
  bigFacultyList.value = bigFacultyListData ? bigFacultyListData : [];
  facultyIndex.value = findFacultyIndex(facultyId.value, bigFacultyList.value);
  setFacultyList(facultyIndex.value[0]);
});

const preAvatarUrl = ref('');
const avatarUrl = ref('');
const onChooseAvatar = (e: { detail: { avatarUrl: string } }) => {
  avatarUrl.value = e.detail.avatarUrl;
};
const role = ref<UserType>(UserType.Student);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRoleChange = (event: any) => {
  role.value = event.detail.value;
};
const pickerChange = (e: { detail: { value: number[] } }) => {
  // console.log('🚀 ~ file: userProfile.vue:116 ~ pickerChange ~ value:', e.detail.value);
  facultyIndex.value = e.detail.value;
};

const pickerColumnChange = (e: { detail: { column: number; value: number } }) => {
  if (e.detail.column === 0) {
    setFacultyList(e.detail.value);
  }
};

const code = ref('');
const isChangeSuccess = ref(false);
const prefix = ref(PhonePrefix.China);
const handleChangePrefix = (newPrefix: PhonePrefix) => {
  prefix.value = newPrefix;
  console.log(prefix.value);
};

const getWxPhoneNumber = (code: string) => {
  api.changeUserPhone(code, 'wechat').then(() => {
    api.getUserInfo().then((res) => {
      phoneNum.value = res.data.info.phone;
      isChangeSuccess.value = true;
      wxPhone.value = res.data.info.phone;
    });
  });
};

const updateProfile = () => {
  if (!wxPhone.value) {
    if (!phoneNum.value) {
      uni.showToast({
        icon: 'error',
        title: '手机号未填写',
      });
      return;
    } else if (!checkPhoneReg(prefix.value, phoneNum.value)) {
      uni.showToast({
        icon: 'error',
        title: '手机号格式错误',
      });
      return;
    }
    if (!/\d{6}/.test(code.value)) {
      uni.showToast({
        icon: 'error',
        title: '验证码格式错误',
      });
      return;
    }
    api.changeUserPhone(`${prefix.value}-${code.value}`, 'code', phoneNum.value).catch((err) => {
      uni.showToast({
        icon: 'none',
        title: err.message,
      });
      return;
    });
  }
  api
    .changeUserInfo(
      {
        realName: realName.value,
        nickname: nickname.value,
        studentId: studentId.value ? studentId.value : '0',
        facultyId: facultyList.value[1][facultyIndex.value[1]].facultyId,
        avatarUrl: avatarUrl.value,
      },
      role.value,
    )
    .then((res) => {
      console.log('info');
      console.log(res);
      uni.showToast({
        icon: 'success',
        title: '填写成功',
      });
      uni.reLaunch({
        url: '/pages/charging/index',
      });
    });
  return;
};

const updateUserProfile = () => {
  if (studentId.value?.length !== 13) {
    uni.showToast({
      icon: 'error',
      title: '学号长度错误',
    });
    return;
  } else if (facultyIndex.value.toString() === [-1, -1].toString()) {
    uni.showToast({
      icon: 'error',
      title: '学院未选择',
    });
    return;
  } else if (nickname.value === '') {
    uni.showToast({
      icon: 'error',
      title: '昵称未填写',
    });
    return;
  } else if (realName.value === '') {
    uni.showToast({
      icon: 'error',
      title: '姓名未填写',
    });
    return;
  } else if (avatarUrl.value === '') {
    uni.showToast({
      icon: 'error',
      title: '头像未选择',
    });
    return;
  } else if (studentId.value?.length != 13) {
    uni.showToast({
      icon: 'error',
      title: '学号长度错误',
    });
    return;
  } else if (nickname.value.length < 2) {
    uni.showToast({
      icon: 'error',
      title: '昵称过短',
    });
    return;
  } else if (realName.value.length < 2) {
    uni.showToast({
      icon: 'error',
      title: '姓名过短',
    });
    return;
  }
  if (preAvatarUrl.value === avatarUrl.value) {
    updateProfile();
    return;
  }
  const URL = 'https://test-api.ddc.ziqiang.nowcent.cn' + '/user/profile/avatar'; // 域名 同时修改个人信息界面的链接
  const auth = uni.getStorageSync('auth');
  uni.uploadFile({
    timeout: 30000,
    url: URL,
    header: {
      Authorization: auth,
    },
    name: 'avatar',
    filePath: avatarUrl.value,
    success: (res) => {
      const resJson = JSON.parse(res.data);
      avatarUrl.value = resJson.data.avatarUrl;
      updateProfile();
    },
    fail: (err) => {
      console.log(err);
      uni.showToast({
        icon: 'error',
        title: '图片上传错误',
      });
    },
  });
};

const nickname = ref('');
const realName = ref('');
const phoneNum = ref('');
const studentId = ref<string>();
const facultyIndex = ref([-1, -1]);
const facultyList = ref<[{ name: string }[], FacultyItemVO[]]>([[], []]);
const bigFacultyList = ref<FacultyFatherVO[]>([]);
const facultyId = ref<number>();
const wxPhone = ref('');

// 设定列表项
const setFacultyList = (id: number) => {
  let departmentList: Array<{ name: string }> = [];
  // debugger;
  if (facultyList.value[0].length === 0) {
    departmentList = bigFacultyList.value.map((item) => {
      return {
        name: item.name,
      };
    });
  } else {
    departmentList = facultyList.value[0];
  }
  facultyList.value = [departmentList, bigFacultyList.value[id].facultyList];
};
</script>

<style scoped>
.ctn {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: auto;
  overflow: hidden;
}

.titleCtn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.write-info {
  font-size: 20px;
  margin-top: 16px;
}

.warning-text {
  margin-top: 4px;
  font-size: 12px;
  color: #ea0000;
  margin-bottom: 25px;
}
.avatar-wrapper {
  margin: 0px;
  max-height: 40px;
  padding: 0;
  background: none;
  border: none;
  outline: none;
}

.bind-phone {
  font-size: 16px;
  color: #808080;
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
}

.mask {
  position: absolute;
  font-size: 10px;
  background-color: black;
  color: #fff;
  width: 40px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  bottom: 0px;
  opacity: 0.6;
}
.avatar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: auto;
  min-height: 60px;
  height: 58px;
  background-color: #fff;
  margin-bottom: 13px;
  padding: 0px 12px;
  font-size: 16px;
}
.input {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: auto;
  height: 58px;
  background-color: #fff;
  margin-bottom: 13px;
  padding: 8px 12px;
  font-size: 16px;
}
.selector {
  align-self: flex-start;
  width: auto;
}

.submit {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0052d9;
  width: calc(auto - 32px);
  margin: 0px 16px;
  flex-direction: column;
  color: #fff;
  border-radius: 2px;
  font-size: 16px;
}

.prefix {
  padding: 5px;
  margin-right: 5px;
  background-color: #e4e4e4;
  font-size: 14px;
  color: #333;
  border-right: 1px solid #ccc;
}
</style>
