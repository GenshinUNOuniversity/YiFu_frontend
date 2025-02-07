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
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "deleteAccount",
  setup(__props) {
    const mpName = "自强电动车";
    const cancel = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "您确定要注销账号吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "注销中"
            });
            api_index.api.deleteAccount().then(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "注销成功",
                icon: "success",
                duration: 2e3
              });
              common_vendor.index.reLaunch();
            }).catch(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "注销失败",
                icon: "error",
                duration: 2e3
              });
            });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(mpName),
        b: common_vendor.t(mpName),
        c: common_vendor.t(mpName),
        d: common_vendor.t(mpName),
        e: common_vendor.o(cancel)
      };
    };
  }
});
wx.createPage(_sfc_main);
