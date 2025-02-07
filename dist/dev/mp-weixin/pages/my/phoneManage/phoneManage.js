"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
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
if (!Math) {
  common_vendor.unref(ProfilePhoneInput)();
}
const ProfilePhoneInput = () => "../../components/profilePhoneInput/profilePhoneInput.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "phoneManage",
  setup(__props) {
    const wxPhone = common_vendor.ref("");
    const phoneNum = common_vendor.ref("");
    const isChangeSuccess = common_vendor.ref(false);
    const code = common_vendor.ref("");
    const getWxPhoneNumber = (code2) => {
      api_index.api.changeUserPhone(code2, "wechat").then(() => {
        api_index.api.getUserInfo().then((res) => {
          phoneNum.value = res.data.info.phone;
          isChangeSuccess.value = true;
          wxPhone.value = res.data.info.phone;
          common_vendor.index.showToast({
            icon: "success",
            title: "手机号修改成功"
          });
        });
      });
    };
    const jumpDeleteAccount = () => {
      common_vendor.index.navigateTo({
        url: "../deleteAccount/deleteAccount"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(getWxPhoneNumber),
        b: common_vendor.o(($event) => phoneNum.value = $event),
        c: common_vendor.o(($event) => code.value = $event),
        d: common_vendor.p({
          type: "change",
          success: isChangeSuccess.value,
          ["phone-num"]: wxPhone.value,
          phone: phoneNum.value,
          code: code.value
        }),
        e: common_vendor.o(jumpDeleteAccount)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f66f984f"]]);
wx.createPage(MiniProgramPage);
