"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const api_chargehistory = require("../../../api/chargehistory.js");
const utils_timeformatter = require("../../../utils/timeformatter.js");
require("../../../api/scooter.js");
require("../../../api/instance.js");
require("../../../utils/jwt.js");
require("../../../business/auth/useAuth.js");
require("../../../api/login.js");
require("../../../api/user.js");
require("../../../api/report.js");
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
  __name: "index",
  setup(__props) {
    const previewPhoto = (url) => {
      if (url === "" || url === null) {
        return;
      }
      common_vendor.index.previewImage({
        urls: [url]
      });
    };
    const statusFormatter = (status) => {
      switch (status) {
        case api_chargehistory.Status.EndedByOther:
          return "被确认充满";
        case api_chargehistory.Status.EndedBySelf:
          return "已充满";
        case api_chargehistory.Status.Using:
          return "正在充电";
        case api_chargehistory.Status.ForcedEnd:
          return "自己结束";
        case api_chargehistory.Status.Using:
          return "正在使用";
        case api_chargehistory.Status.EndedPeacefully:
          return "正常到时间结束";
        default:
          return "未知情况";
      }
    };
    const chargeList = common_vendor.ref([]);
    const startReport = (chargeHistoryId) => {
      common_vendor.index.navigateTo({
        url: `/pages/report/report?whichKind=chargeHistory&chargeHistory=${JSON.stringify(
          chargeList.value.filter((item) => item.chargeHistoryId === chargeHistoryId)[0]
        )}`
      });
    };
    const isLoadingHistory = common_vendor.ref(false);
    const hasMoreHistory = common_vendor.ref(true);
    const historyPageNum = common_vendor.ref(1);
    const getHistory = async () => {
      api_index.api.getChargeHistory({
        pageNum: historyPageNum.value,
        pageSize: 5
      }).then((res) => {
        chargeList.value = chargeList.value.concat(
          res.data.data.map((item) => {
            item.begin = new Date(item.begin);
            item.end = item.end ? new Date(item.end) : void 0;
            return item;
          })
        ).sort((b, a) => common_vendor.compareAsc(a.begin, b.begin));
        if (historyPageNum.value * 5 >= res.data.total) {
          hasMoreHistory.value = false;
        } else {
          historyPageNum.value += 1;
        }
        common_vendor.index.hideLoading();
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "获取充电历史失败",
          icon: "none"
        });
      });
    };
    common_vendor.onReachBottom(async () => {
      if (hasMoreHistory.value && !isLoadingHistory.value) {
        isLoadingHistory.value = true;
        await getHistory();
        isLoadingHistory.value = false;
      }
    });
    common_vendor.onLoad(() => {
      common_vendor.index.showLoading({ title: "加载中" });
      getHistory();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(chargeList.value, (charge, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(charge.stationName),
            b: common_vendor.t(charge.pileName),
            c: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)(charge.begin)),
            d: common_vendor.t(statusFormatter(charge.status)),
            e: charge.status === common_vendor.unref(api_chargehistory.Status).Using ? "#056334" : "rgba(0, 0, 0, 0.4)",
            f: charge.status !== common_vendor.unref(api_chargehistory.Status).Using
          }, charge.status !== common_vendor.unref(api_chargehistory.Status).Using ? {
            g: charge.endPhotoUrl,
            h: common_vendor.o(($event) => previewPhoto(charge.endPhotoUrl), charge.chargeHistoryId),
            i: charge.movePhotoUrl,
            j: common_vendor.o(($event) => previewPhoto(charge.movePhotoUrl), charge.chargeHistoryId),
            k: common_vendor.t(charge.moveDesc ? charge.moveDesc : "无移车备注")
          } : {}, {
            l: common_vendor.t(charge.scooterCode),
            m: charge.end
          }, charge.end ? {
            n: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)(charge.end))
          } : {
            o: common_vendor.t(charge.expectHour)
          }, {
            p: common_vendor.o(($event) => startReport(charge.chargeHistoryId), charge.chargeHistoryId),
            q: charge.chargeHistoryId
          });
        }),
        b: common_vendor.p({
          ["has-more"]: hasMoreHistory.value,
          ["is-loading"]: isLoadingHistory.value
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-29d0e09c"]]);
wx.createPage(MiniProgramPage);
