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
  BottomLoadingPrompt();
}
const BottomLoadingPrompt = () => "../../components/bottomLoadingPrompt/bottomLoadingPrompt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "auditScooter",
  setup(__props) {
    common_vendor.onLoad(() => {
      common_vendor.index.getSetting({
        withSubscriptions: true
        // success: ({ subscriptionsSetting }) => {},
      });
      getAuditScooterList();
    });
    const scooterCode = common_vendor.ref("");
    const userInfo = common_vendor.ref();
    const auditScooterListPageNum = common_vendor.ref(1);
    const hasMoreAuditScooterList = common_vendor.ref(true);
    const isLoadingAuditScooterList = common_vendor.ref(false);
    const auditScooterList = common_vendor.ref([]);
    const getAuditScooterList = async () => {
      isLoadingAuditScooterList.value = true;
      api_index.api.managerGetAuditScooterList({ pageNum: auditScooterListPageNum.value, pageSize: 5 }).then((res) => {
        auditScooterList.value = auditScooterList.value.concat(res.data.data);
        if (auditScooterListPageNum.value * 5 >= res.data.total) {
          hasMoreAuditScooterList.value = false;
        } else {
          auditScooterListPageNum.value += 1;
        }
        common_vendor.index.hideLoading();
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "获取待审核电动车失败",
          icon: "none"
        });
      }).finally(() => {
        isLoadingAuditScooterList.value = false;
      });
    };
    common_vendor.onPullDownRefresh(async () => {
      common_vendor.index.showLoading({
        title: "加载中"
      });
      auditScooterList.value = [];
      hasMoreAuditScooterList.value = true;
      auditScooterListPageNum.value = 1;
      await getAuditScooterList();
      common_vendor.index.hideLoading();
    });
    common_vendor.onReachBottom(async () => {
      if (hasMoreAuditScooterList.value && !isLoadingAuditScooterList.value) {
        await getAuditScooterList();
      }
    });
    const scooterCodeReg = /^[A-Z]?\d{1,4}$/;
    common_vendor.watch(scooterCode, (scooterCode2) => {
      if (!scooterCodeReg.test(scooterCode2) || scooterCode2 === void 0) {
        return;
      }
      userInfo.value = void 0;
      api_index.api.managerGetUserInfoByScooterCode(scooterCode2).then((res) => {
        userInfo.value = res.data;
      }).catch(() => {
        userInfo.value = void 0;
      });
    });
    const toAuditDetail = (code) => {
      common_vendor.index.navigateTo({
        url: `/pages/manager/auditScooter/scooterDetail?scooterCode=${code}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: scooterCode.value,
        b: common_vendor.o(($event) => scooterCode.value = $event.detail.value),
        c: userInfo.value
      }, userInfo.value ? {
        d: common_vendor.t(scooterCode.value),
        e: common_vendor.o(($event) => toAuditDetail(scooterCode.value))
      } : {}, {
        f: common_vendor.f(auditScooterList.value, (scooter, k0, i0) => {
          return {
            a: common_vendor.t(scooter.code),
            b: common_vendor.o(($event) => toAuditDetail(scooter.code), scooter.scooterId),
            c: scooter.scooterId
          };
        }),
        g: common_vendor.p({
          ["has-more"]: hasMoreAuditScooterList.value,
          ["is-loading"]: isLoadingAuditScooterList.value,
          ["no-data"]: !(isLoadingAuditScooterList.value || auditScooterList.value.length !== 0)
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-774953dd"]]);
wx.createPage(MiniProgramPage);
