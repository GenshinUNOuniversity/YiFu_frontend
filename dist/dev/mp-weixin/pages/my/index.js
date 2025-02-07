"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const business_track_useTrack = require("../../business/track/useTrack.js");
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
    const trackService = business_track_useTrack.useTrack();
    const status = common_vendor.ref(common_vendor.index.getStorageSync("status") || "None");
    const userInfo = common_vendor.ref();
    const normalScooters = common_vendor.ref([]);
    const auditingScooters = common_vendor.ref([]);
    const rejectedScooters = common_vendor.ref([]);
    const isLogin = common_vendor.ref(!(common_vendor.index.getStorageSync("auth") === ""));
    const login = async () => {
      try {
        await api_index.api.login();
        isLogin.value = true;
        onShowFun();
      } catch (error) {
        common_vendor.index.showToast({
          title: "登录失败",
          icon: "error"
        });
      }
    };
    const onShowFun = async () => {
      await api_index.api.getUserInfo().then((res) => {
        var _a;
        userInfo.value = res.data;
        status.value = userInfo.value.role;
        if ((_a = res.data.extend.manager) == null ? void 0 : _a.stationId) {
          common_vendor.index.setStorage({
            key: "stationId",
            data: res.data.extend.manager.stationId
          });
        }
      });
      api_index.api.getUserScooterList({
        pageNum: 1,
        pageSize: 100
      }).then((res) => {
        normalScooters.value = res.data.data.filter((scooter) => {
          return scooter.status === "Normal";
        });
        auditingScooters.value = res.data.data.filter((scooter) => {
          return scooter.status === "Auditing";
        });
        rejectedScooters.value = res.data.data.filter((scooter) => {
          return scooter.status === "Rejected";
        });
      });
      trackService.doTrack({
        pgid: trackService.PageId.My,
        eid: "",
        eventId: trackService.EventId.IMPL
      });
    };
    common_vendor.onShow(() => {
      onShowFun();
    });
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: !isLogin.value
      }, !isLogin.value ? {
        b: ((_a = userInfo.value) == null ? void 0 : _a.info.avatarUrl) || "../../static/avatar.png",
        c: common_vendor.o(login)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-276ac604"]]);
wx.createPage(MiniProgramPage);
