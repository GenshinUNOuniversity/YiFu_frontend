"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_phonePrefix = require("../../../utils/phonePrefix.js");
require("../../../api/scooter.js");
require("../../../api/instance.js");
require("../../../utils/jwt.js");
require("../../../business/auth/useAuth.js");
require("../../../api/login.js");
require("../../../api/user.js");
require("../../../api/report.js");
require("../../../api/chargehistory.js");
require("../../../api/track.js");
require("../../../api/news.js");
require("../../../api/station.js");
require("../../../api/banner.js");
require("../../../api/blacklist.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "profilePhoneInput",
  props: {
    success: { type: Boolean },
    phoneNum: null,
    type: null
  },
  emits: ["update:phone", "update:code", "wxPhoneCode", "prefix"],
  setup(__props, { emit }) {
    const props = __props;
    const localPhone = common_vendor.ref("");
    const isInputNumber = common_vendor.ref(false);
    const isChangeSuccess = common_vendor.ref(false);
    const timeWait = common_vendor.ref(0);
    const startTime = common_vendor.ref();
    const isWaiting = common_vendor.ref(false);
    const localCode = common_vendor.ref("");
    let timeout;
    const isRequestCode = common_vendor.ref(false);
    const prefix = common_vendor.ref("+86");
    const prefixIndex = common_vendor.ref(0);
    const prefixArr = [
      { label: "中国大陆（+86）", code: utils_phonePrefix.PhonePrefix.China },
      { label: "中国香港（+852）", code: utils_phonePrefix.PhonePrefix.HongKong },
      { label: "中国澳门（+853）", code: utils_phonePrefix.PhonePrefix.Macao },
      { label: "中国台湾（+886）", code: utils_phonePrefix.PhonePrefix.Taiwan }
    ];
    common_vendor.watch(
      () => props.success,
      (value) => {
        console.log(value);
        if (value) {
          updateCode("");
          isChangeSuccess.value = true;
          if (props.phoneNum) {
            updatePhone(props.phoneNum);
          }
        }
      }
    );
    const handlePrefixChange = (index) => {
      prefixIndex.value = index;
      prefix.value = prefixArr[prefixIndex.value].code;
      emit("prefix", prefix.value);
    };
    const updatePhone = (value) => {
      localPhone.value = value;
      emit("update:phone", value);
    };
    const updateCode = (value) => {
      localCode.value = value;
      emit("update:code", value);
    };
    const countDown = () => {
      if (startTime.value && startTime.value.getTime() + 60 * 1e3 <= (/* @__PURE__ */ new Date()).getTime() && isWaiting.value) {
        isWaiting.value = false;
        startTime.value = void 0;
      } else {
        isWaiting.value = true;
        if (!startTime.value) {
          startTime.value = /* @__PURE__ */ new Date();
        }
        timeWait.value = Math.floor((startTime.value.getTime() + 60 * 1e3 - (/* @__PURE__ */ new Date()).getTime()) / 1e3);
        timeout = setTimeout(() => {
          countDown();
        }, 1e3);
      }
    };
    const handleInputPhoneFocus = () => {
      isInputNumber.value = true;
    };
    const handleInputPhoneBlur = () => {
      if (localPhone.value.length === 0) {
        isInputNumber.value = false;
      }
    };
    const getPhoneNumber = (e) => {
      if (e.detail.errMsg !== "getPhoneNumber:ok") {
        common_vendor.index.showToast({
          icon: "error",
          title: "获取手机号失败"
        });
        return;
      }
      emit("wxPhoneCode", e.detail.code);
    };
    const getUserPhoneCode = () => {
      if (isWaiting.value) {
        common_vendor.index.showToast({
          icon: "error",
          title: `请等待${timeWait.value}秒`
        });
        return;
      }
      if (!utils_phonePrefix.checkPhoneReg(prefixArr[prefixIndex.value].code, localPhone.value)) {
        common_vendor.index.showToast({
          icon: "error",
          title: "手机号格式错误"
        });
        return;
      }
      api_index.api.getUserPhoneCode(encodeURIComponent(`${prefix.value}-${localPhone.value}`)).then(() => {
        common_vendor.index.showToast({
          icon: "success",
          title: "验证码已发送"
        });
        isRequestCode.value = true;
        countDown();
      }).catch((err) => {
        common_vendor.index.showToast({
          icon: "none",
          title: err.message
        });
        if (timeout) {
          clearTimeout(timeout);
        }
        isWaiting.value = false;
        timeWait.value = 0;
      });
    };
    const changeUserPhoneByCode = () => {
      if (!utils_phonePrefix.checkPhoneReg(prefixArr[prefixIndex.value].code, localPhone.value)) {
        common_vendor.index.showToast({
          icon: "error",
          title: "手机号格式错误"
        });
        return;
      }
      if (!/\d{6}/.test(localCode.value)) {
        common_vendor.index.showToast({
          icon: "error",
          title: "验证码格式错误"
        });
        return;
      }
      api_index.api.changeUserPhone(localCode.value, "code", localPhone.value).then(() => {
        common_vendor.index.showToast({
          icon: "success",
          title: "手机号修改成功"
        });
        isChangeSuccess.value = true;
        isInputNumber.value = false;
      }).catch((err) => {
        common_vendor.index.showToast({
          icon: "none",
          title: err.message
        });
        return;
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.type === "profile"
      }, __props.type === "profile" ? {} : {}, {
        b: !__props.phoneNum
      }, !__props.phoneNum ? {
        c: common_vendor.t(prefix.value),
        d: prefixArr,
        e: prefixIndex.value,
        f: common_vendor.o(($event) => handlePrefixChange($event.detail.value))
      } : {}, {
        g: isChangeSuccess.value,
        h: common_vendor.o(handleInputPhoneFocus),
        i: common_vendor.o(handleInputPhoneBlur),
        j: common_vendor.o([($event) => localPhone.value = $event.detail.value, ($event) => updatePhone($event.detail.value)]),
        k: localPhone.value,
        l: isChangeSuccess.value
      }, isChangeSuccess.value ? {
        m: common_vendor.t(__props.type === "change" ? "修改成功" : "获取成功")
      } : !isInputNumber.value ? {
        o: common_vendor.o(getPhoneNumber)
      } : {
        p: common_vendor.t(isWaiting.value ? timeWait.value + "秒后再次发送" : "发送验证码"),
        q: common_vendor.o(getUserPhoneCode)
      }, {
        n: !isInputNumber.value,
        r: isInputNumber.value
      }, isInputNumber.value ? common_vendor.e({
        s: common_vendor.o([($event) => localCode.value = $event.detail.value, ($event) => updateCode($event.detail.value)]),
        t: localCode.value,
        v: __props.type === "change"
      }, __props.type === "change" ? {
        w: !/\d{6}/.test(localCode.value) && !isRequestCode.value,
        x: common_vendor.o(changeUserPhoneByCode)
      } : {}) : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4bdb9b47"]]);
wx.createComponent(Component);
