"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const api_user = require("../../../api/user.js");
const utils_faculty = require("../../../utils/faculty.js");
const utils_phonePrefix = require("../../../utils/phonePrefix.js");
require("../../../api/scooter.js");
require("../../../api/instance.js");
require("../../../utils/jwt.js");
require("../../../business/auth/useAuth.js");
require("../../../api/login.js");
require("../../../api/report.js");
require("../../../api/chargehistory.js");
require("../../../api/track.js");
require("../../../api/news.js");
require("../../../api/station.js");
require("../../../api/banner.js");
require("../../../api/blacklist.js");
if (!Math) {
  common_vendor.unref(ProfilePhoneInput)();
}
const ProfilePhoneInput = () => "../profilePhoneInput/profilePhoneInput.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "userProfile",
  setup(__props) {
    common_vendor.onLoad(async () => {
      const { data } = await api_index.api.getUserInfo();
      realName.value = data.info.realName;
      nickname.value = data.info.nickname;
      phoneNum.value = data.info.phone;
      studentId.value = data.info.studentId;
      facultyId.value = data.info.facultyId;
      avatarUrl.value = data.info.avatarUrl;
      preAvatarUrl.value = data.info.avatarUrl;
      const { data: bigFacultyListData } = await api_index.api.getFacultyList();
      console.log("🚀 ~ file: userProfile.vue:102 ~ onLoad ~ bigFacultyListData:", bigFacultyListData);
      bigFacultyList.value = bigFacultyListData ? bigFacultyListData : [];
      facultyIndex.value = utils_faculty.findFacultyIndex(facultyId.value, bigFacultyList.value);
      setFacultyList(facultyIndex.value[0]);
    });
    const preAvatarUrl = common_vendor.ref("");
    const avatarUrl = common_vendor.ref("");
    const onChooseAvatar = (e) => {
      avatarUrl.value = e.detail.avatarUrl;
    };
    const role = common_vendor.ref(api_user.UserType.Student);
    const handleRoleChange = (event) => {
      role.value = event.detail.value;
    };
    const pickerChange = (e) => {
      facultyIndex.value = e.detail.value;
    };
    const pickerColumnChange = (e) => {
      if (e.detail.column === 0) {
        setFacultyList(e.detail.value);
      }
    };
    const code = common_vendor.ref("");
    const isChangeSuccess = common_vendor.ref(false);
    const prefix = common_vendor.ref(utils_phonePrefix.PhonePrefix.China);
    const handleChangePrefix = (newPrefix) => {
      prefix.value = newPrefix;
      console.log(prefix.value);
    };
    const getWxPhoneNumber = (code2) => {
      api_index.api.changeUserPhone(code2, "wechat").then(() => {
        api_index.api.getUserInfo().then((res) => {
          phoneNum.value = res.data.info.phone;
          isChangeSuccess.value = true;
          wxPhone.value = res.data.info.phone;
        });
      });
    };
    const updateProfile = () => {
      if (!wxPhone.value) {
        if (!phoneNum.value) {
          common_vendor.index.showToast({
            icon: "error",
            title: "手机号未填写"
          });
          return;
        } else if (!utils_phonePrefix.checkPhoneReg(prefix.value, phoneNum.value)) {
          common_vendor.index.showToast({
            icon: "error",
            title: "手机号格式错误"
          });
          return;
        }
        if (!/\d{6}/.test(code.value)) {
          common_vendor.index.showToast({
            icon: "error",
            title: "验证码格式错误"
          });
          return;
        }
        api_index.api.changeUserPhone(`${prefix.value}-${code.value}`, "code", phoneNum.value).catch((err) => {
          common_vendor.index.showToast({
            icon: "none",
            title: err.message
          });
          return;
        });
      }
      api_index.api.changeUserInfo(
        {
          realName: realName.value,
          nickname: nickname.value,
          studentId: studentId.value ? studentId.value : "0",
          facultyId: facultyList.value[1][facultyIndex.value[1]].facultyId,
          avatarUrl: avatarUrl.value
        },
        role.value
      ).then((res) => {
        console.log("info");
        console.log(res);
        common_vendor.index.showToast({
          icon: "success",
          title: "填写成功"
        });
        common_vendor.index.reLaunch({
          url: "/pages/charging/index"
        });
      });
      return;
    };
    const updateUserProfile = () => {
      var _a, _b;
      if (((_a = studentId.value) == null ? void 0 : _a.length) !== 13) {
        common_vendor.index.showToast({
          icon: "error",
          title: "学号长度错误"
        });
        return;
      } else if (facultyIndex.value.toString() === [-1, -1].toString()) {
        common_vendor.index.showToast({
          icon: "error",
          title: "学院未选择"
        });
        return;
      } else if (nickname.value === "") {
        common_vendor.index.showToast({
          icon: "error",
          title: "昵称未填写"
        });
        return;
      } else if (realName.value === "") {
        common_vendor.index.showToast({
          icon: "error",
          title: "姓名未填写"
        });
        return;
      } else if (avatarUrl.value === "") {
        common_vendor.index.showToast({
          icon: "error",
          title: "头像未选择"
        });
        return;
      } else if (((_b = studentId.value) == null ? void 0 : _b.length) != 13) {
        common_vendor.index.showToast({
          icon: "error",
          title: "学号长度错误"
        });
        return;
      } else if (nickname.value.length < 2) {
        common_vendor.index.showToast({
          icon: "error",
          title: "昵称过短"
        });
        return;
      } else if (realName.value.length < 2) {
        common_vendor.index.showToast({
          icon: "error",
          title: "姓名过短"
        });
        return;
      }
      if (preAvatarUrl.value === avatarUrl.value) {
        updateProfile();
        return;
      }
      const URL = "https://test-api.ddc.ziqiang.nowcent.cn/user/profile/avatar";
      const auth = common_vendor.index.getStorageSync("auth");
      common_vendor.index.uploadFile({
        timeout: 3e4,
        url: URL,
        header: {
          Authorization: auth
        },
        name: "avatar",
        filePath: avatarUrl.value,
        success: (res) => {
          const resJson = JSON.parse(res.data);
          avatarUrl.value = resJson.data.avatarUrl;
          updateProfile();
        },
        fail: (err) => {
          console.log(err);
          common_vendor.index.showToast({
            icon: "error",
            title: "图片上传错误"
          });
        }
      });
    };
    const nickname = common_vendor.ref("");
    const realName = common_vendor.ref("");
    const phoneNum = common_vendor.ref("");
    const studentId = common_vendor.ref();
    const facultyIndex = common_vendor.ref([-1, -1]);
    const facultyList = common_vendor.ref([[], []]);
    const bigFacultyList = common_vendor.ref([]);
    const facultyId = common_vendor.ref();
    const wxPhone = common_vendor.ref("");
    const setFacultyList = (id) => {
      let departmentList = [];
      if (facultyList.value[0].length === 0) {
        departmentList = bigFacultyList.value.map((item) => {
          return {
            name: item.name
          };
        });
      } else {
        departmentList = facultyList.value[0];
      }
      facultyList.value = [departmentList, bigFacultyList.value[id].facultyList];
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(api_user.UserType).Student,
        b: role.value === common_vendor.unref(api_user.UserType).Student,
        c: common_vendor.unref(api_user.UserType).Staff,
        d: role.value === common_vendor.unref(api_user.UserType).Staff,
        e: common_vendor.o(handleRoleChange),
        f: !avatarUrl.value
      }, !avatarUrl.value ? {} : {
        g: avatarUrl.value
      }, {
        h: common_vendor.o(onChooseAvatar),
        i: realName.value,
        j: common_vendor.o(($event) => realName.value = $event.detail.value),
        k: nickname.value,
        l: common_vendor.o(($event) => nickname.value = $event.detail.value),
        m: common_vendor.o(getWxPhoneNumber),
        n: common_vendor.o(handleChangePrefix),
        o: common_vendor.o(($event) => phoneNum.value = $event),
        p: common_vendor.o(($event) => code.value = $event),
        q: common_vendor.p({
          type: "profile",
          success: isChangeSuccess.value,
          ["phone-num"]: wxPhone.value,
          phone: phoneNum.value,
          code: code.value
        }),
        r: common_vendor.t(role.value === "STUDENT" ? "学号" : "工号"),
        s: studentId.value,
        t: common_vendor.o(($event) => studentId.value = $event.detail.value),
        v: facultyIndex.value[0] !== -1 && facultyList.value
      }, facultyIndex.value[0] !== -1 && facultyList.value ? {
        w: common_vendor.t(facultyList.value[1][facultyIndex.value[1]].name)
      } : {}, {
        x: facultyIndex.value,
        y: facultyList.value,
        z: common_vendor.o(pickerChange),
        A: common_vendor.o(pickerColumnChange),
        B: common_vendor.o(updateUserProfile)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a6913b71"]]);
wx.createPage(MiniProgramPage);
