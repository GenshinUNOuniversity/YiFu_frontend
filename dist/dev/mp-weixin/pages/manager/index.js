"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
require("../../api/scooter.js");
require("../../api/instance.js");
require("../../utils/jwt.js");
require("../../business/auth/useAuth.js");
require("../../api/login.js");
require("../../api/user.js");
require("../../api/report.js");
require("../../api/chargehistory.js");
require("../../api/track.js");
require("../../api/news.js");
require("../../api/station.js");
require("../../api/banner.js");
require("../../api/blacklist.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const safeAreaTop = common_vendor.ref(44);
    const userInfo = common_vendor.ref();
    const stationName = common_vendor.ref("");
    const showSubscribePic = () => {
      api_index.api.getWXPusherQrCode().then((res) => {
        common_vendor.index.showToast;
        common_vendor.index.previewImage({
          urls: [res.data]
        });
      });
    };
    common_vendor.onShow(() => {
      common_vendor.index.getSystemInfo({
        success: (rusult) => {
          safeAreaTop.value = rusult.safeArea.top;
          console.log(safeAreaTop.value);
        }
      });
    });
    common_vendor.onLoad(() => {
      api_index.api.getUserInfo().then((res) => {
        var _a, _b;
        userInfo.value = res.data;
        if ((_a = res.data.extend.manager) == null ? void 0 : _a.stationId) {
          common_vendor.index.setStorage({
            key: "stationId",
            data: res.data.extend.manager.stationId
          });
          api_index.api.getStationInfo({ stationId: (_b = res.data.extend.manager) == null ? void 0 : _b.stationId }).then((res2) => {
            stationName.value = res2.data.name;
          });
        }
        if (userInfo.value.role === "None" || userInfo.value.role === "User") {
          common_vendor.index.showModal({
            title: "警告",
            content: "不要乱搞，你没有权限看这个，快走快走",
            confirmText: "我马上走",
            showCancel: false,
            success: () => {
              common_vendor.index.switchTab({ url: "/pages/charging/index" });
            }
          });
        }
      }).catch(() => {
        common_vendor.index.showModal({
          title: "警告",
          content: "不要乱搞，你没有权限看这个，快走快走",
          confirmText: "我马上走",
          showCancel: false,
          success: () => {
            common_vendor.index.switchTab({ url: "/pages/charging/index" });
          }
        });
      });
    });
    const jumpTo = (url) => {
      common_vendor.index.navigateTo({ url: `./${url}/${url}` });
    };
    const backHome = () => {
      common_vendor.index.switchTab({ url: "/pages/charging/index" });
    };
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return {
        a: safeAreaTop.value + "px",
        b: (_a = userInfo.value) == null ? void 0 : _a.info.avatarUrl,
        c: common_vendor.t(((_b = userInfo.value) == null ? void 0 : _b.info.nickname) ? (_c = userInfo.value) == null ? void 0 : _c.info.nickname : "你怎么还没有名字"),
        d: common_vendor.t(stationName.value ? stationName.value : "充电站怎么还没有名字"),
        e: common_vendor.o(showSubscribePic),
        f: common_vendor.o(($event) => jumpTo("newsManage")),
        g: common_vendor.o(($event) => jumpTo("handleReport")),
        h: common_vendor.o(($event) => jumpTo("auditScooter")),
        i: common_vendor.o(($event) => jumpTo("blacklist")),
        j: common_vendor.o(($event) => jumpTo("station")),
        k: common_vendor.o(backHome)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2e9f2ddb"]]);
wx.createPage(MiniProgramPage);
