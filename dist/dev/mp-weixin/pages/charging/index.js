"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const business_track_useTrack = require("../../business/track/useTrack.js");
const pages_charging_useCharge = require("./useCharge.js");
const utils_timeformatter = require("../../utils/timeformatter.js");
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
require("../../utils/location.js");
const _sfc_defineComponent = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const {
      inProgressHistory,
      updateInProgressHistory,
      // getNews,
      // newsList,
      // getBanner,
      // bannerList,
      getStationList,
      nearestStationInfo,
      distanceToNearestStation
      // newsListHasMore,
    } = pages_charging_useCharge.useCharge();
    const { doTrack, PageId, EventId } = business_track_useTrack.useTrack();
    const scootersDetail = common_vendor.ref([]);
    const trackService = business_track_useTrack.useTrack();
    const bindScooter = () => {
      common_vendor.index.navigateTo({
        url: `/pages/my/edit/edit?haveScooter=false`
      });
    };
    const isAuditing = common_vendor.ref(false);
    const userId = common_vendor.ref(common_vendor.index.getStorageSync("userId"));
    const isUserNormal = common_vendor.ref(false);
    const status = common_vendor.ref(common_vendor.index.getStorageSync("status") || "None");
    const isUserAuditing = common_vendor.ref(false);
    const isLogin = common_vendor.ref(!(common_vendor.index.getStorageSync("auth") === ""));
    common_vendor.onLoad(async () => {
      trackService.doTrack({
        pgid: trackService.PageId.My,
        eid: "",
        eventId: trackService.EventId.IMPL
      });
    });
    common_vendor.onShow(async () => {
      getStationList();
      await common_vendor.nextTick$1();
      console.log("🚀 ~ file: index.vue:206 ~ onShow ~ status.value:", status.value);
      if (status.value === "None") {
        const { data: userInfo } = await api_index.api.getUserInfo();
        status.value = userInfo.role;
      }
      if (status.value !== "None") {
        updateInProgressHistory();
        await api_index.api.getUserStatus().then((res) => {
          common_vendor.index.hideLoading();
          if (res.data.normal === true) {
            isUserNormal.value = true;
          }
          isUserAuditing.value = true;
          if (res.data.blackListReason) {
            blackListReason.value = res.data.blackListReason;
          }
        }).catch((err) => {
          var _a;
          console.log("🚀 ~ file: index.vue:222 ~ onShow ~ err:", err);
          if (((_a = err.data) == null ? void 0 : _a.code) === "40005") {
            isUserNormal.value === false;
          }
          common_vendor.index.showModal({
            title: "加载失败",
            content: err.message
          });
        });
        await api_index.api.getUserScooterList({
          pageNum: 1,
          pageSize: 50
        }).then((res) => {
          scootersDetail.value = res.data.data.filter((scooter) => {
            return scooter.status === "Normal" || scooter.status === "Auditing";
          });
        }).catch((err) => {
          if (err.data.code === "40005") {
            isAuditing.value = true;
          }
        }).finally(() => {
          console.log("ntm");
        });
      }
      userId.value = common_vendor.index.getStorageSync("userId");
    });
    const navigationHeight = common_vendor.ref(0);
    const widthStyle = common_vendor.ref("calc(100% - 64rpx)");
    const calNum = common_vendor.ref(1);
    common_vendor.onPageScroll(({ scrollTop }) => {
      if (scrollTop > 232) {
        if (scrollTop < 320) {
          calNum.value = (320 - scrollTop) / 88;
          widthStyle.value = "calc(100% - ((100% - 349px) * " + calNum.value + " ))";
          navigationHeight.value = (scrollTop - 232) / 88 * 88;
        } else {
          widthStyle.value = "100%";
          navigationHeight.value = 88;
        }
      } else {
        navigationHeight.value = 0;
        widthStyle.value = "calc(100% - 64rpx)";
      }
    });
    const jumpChargeHistory = () => {
      common_vendor.index.navigateTo({ url: "./chargeHistory/index" });
    };
    const startScan = () => {
      doTrack({
        pgid: PageId.Charge,
        eid: "scan_to_charge_btn",
        eventId: EventId.CLIK
      });
      common_vendor.index.scanCode({
        onlyFromCamera: true,
        scanType: ["wxCode"],
        success: (res) => {
          if (res.scanType === "WX_CODE" && res.path) {
            if (res.path.indexOf("type=charging") !== -1) {
              const query = res.path.replaceAll("&type=charging", "");
              common_vendor.index.navigateTo({ url: `/pages/charging/prepareCharge/index${query}` });
            }
          } else {
            common_vendor.index.showModal({
              title: "二维码解析失败",
              content: "请扫描正确的二维码",
              showCancel: false
            });
          }
        },
        fail: (error) => {
          const message = error.errMsg;
          if (message !== "scanCode:fail cancel") {
            common_vendor.index.showModal({
              title: "二维码解析失败",
              content: "请扫描正确的二维码",
              showCancel: false
            });
          }
        }
      });
    };
    const startReport = () => {
      var _a, _b;
      common_vendor.index.navigateTo({
        url: `/pages/report/report?whichKind=stationId&stationName=${(_a = nearestStationInfo.value) == null ? void 0 : _a.name}&stationId=${(_b = nearestStationInfo.value) == null ? void 0 : _b.stationId}`
      });
    };
    const finishCharging = () => {
      common_vendor.index.showModal({
        title: "结束充电",
        content: "请问要提前结束充电吗",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            api_index.api.endChargeScooter({
              scooterId: scootersDetail.value[0].scooterId
            }).then(() => {
              updateInProgressHistory();
              getStationList();
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    };
    const blackListReason = common_vendor.ref();
    const showBlackReason = () => {
      if (!blackListReason.value) {
        return;
      }
      common_vendor.index.showModal({
        title: "拉黑原因",
        showCancel: false,
        content: `拉黑充电站：${blackListReason.value.stationName}\r
拉黑管理员：${blackListReason.value.managerName}\r
原因：${blackListReason.value.reason}\r
解封时间：${utils_timeformatter.timeFormatter(blackListReason.value.due)}`
      });
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g;
      return common_vendor.e({
        a: common_vendor.unref(inProgressHistory)
      }, common_vendor.unref(inProgressHistory) ? {
        b: common_vendor.t(common_vendor.unref(inProgressHistory).expectHour),
        c: navigationHeight.value + "px",
        d: common_vendor.t(common_vendor.unref(inProgressHistory).scooterCode),
        e: common_vendor.t(common_vendor.unref(utils_timeformatter.timeFormatter)(common_vendor.unref(inProgressHistory).end)),
        f: common_vendor.t(common_vendor.unref(inProgressHistory).stationName),
        g: common_vendor.t(common_vendor.unref(inProgressHistory).pileName),
        h: common_vendor.o(finishCharging),
        i: widthStyle.value
      } : {}, {
        j: isUserAuditing.value
      }, isUserAuditing.value ? common_vendor.e({
        k: common_vendor.t((_a = common_vendor.unref(nearestStationInfo)) == null ? void 0 : _a.name),
        l: common_vendor.t(common_vendor.unref(distanceToNearestStation)),
        m: isUserNormal.value === false
      }, isUserNormal.value === false ? {
        n: common_vendor.o(showBlackReason)
      } : common_vendor.unref(inProgressHistory) ? {} : scootersDetail.value.filter((scooter) => {
        return scooter.status === "Normal";
      }).length > 0 ? common_vendor.e({
        q: (_b = common_vendor.unref(nearestStationInfo)) == null ? void 0 : _b.stat
      }, ((_c = common_vendor.unref(nearestStationInfo)) == null ? void 0 : _c.stat) ? {
        r: common_vendor.t(((_e = (_d = common_vendor.unref(nearestStationInfo)) == null ? void 0 : _d.stat) == null ? void 0 : _e.free) + "空闲"),
        s: common_vendor.t(((_g = (_f = common_vendor.unref(nearestStationInfo)) == null ? void 0 : _f.stat) == null ? void 0 : _g.soon) + "即将空闲")
      } : {}, {
        t: common_vendor.o(startScan)
      }) : scootersDetail.value.filter((scooter) => {
        return scooter.status === "Auditing";
      }).length > 0 ? {} : {
        w: common_vendor.o(bindScooter)
      }, {
        o: common_vendor.unref(inProgressHistory),
        p: scootersDetail.value.filter((scooter) => {
          return scooter.status === "Normal";
        }).length > 0,
        v: scootersDetail.value.filter((scooter) => {
          return scooter.status === "Auditing";
        }).length > 0,
        x: common_vendor.o(startReport),
        y: common_vendor.o(jumpChargeHistory)
      }) : !isLogin.value ? {} : isUserNormal.value === false ? {} : {}, {
        z: !isLogin.value,
        A: isUserNormal.value === false
      });
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 1;
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_defineComponent, [["__scopeId", "data-v-0979a525"]]);
wx.createPage(MiniProgramPage);
