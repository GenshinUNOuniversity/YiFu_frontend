"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const utils_timeformatter = require("../../../utils/timeformatter.js");
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
if (!Array) {
  const _component_template = common_vendor.resolveComponent("template");
  _component_template();
}
if (!Math) {
  BottomLoadingPrompt();
}
const BottomLoadingPrompt = () => "../../components/bottomLoadingPrompt/bottomLoadingPrompt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "handleReport",
  setup(__props) {
    const stationId = common_vendor.index.getStorageSync("stationId");
    const selectItems = common_vendor.ref("Committed");
    const handleSelectChange = ({ detail: { value } }) => {
      selectItems.value = value;
    };
    common_vendor.onLoad(() => {
      common_vendor.index.getSetting({
        withSubscriptions: true,
        success: (res) => {
          if (res.subscriptionsSetting.mainSwitch === false) {
            common_vendor.index.showToast({
              icon: "error",
              title: "请允许消息通知",
              duration: 1e4
            });
          }
          if (res.subscriptionsSetting[managerReportSubscribeId] === "accept") {
            isSubscribed.value = true;
          }
        }
      });
    });
    common_vendor.onShow(() => {
      reportList.value = [];
      showReportList.value = [];
      reportListPageNum.value = 1;
      isReportListLoading.value = false;
      hasMoreReportList.value = true;
    });
    const reportList = common_vendor.ref([]);
    const showReportList = common_vendor.ref([]);
    const reportListPageNum = common_vendor.ref(1);
    const isReportListLoading = common_vendor.ref(false);
    const hasMoreReportList = common_vendor.ref(true);
    common_vendor.watch([reportList, selectItems], ([newReportList, newSelectItems]) => {
      showReportList.value = newReportList.filter((report) => newSelectItems.includes(report.status));
      console.log("www", hasMoreReportList.value && !isReportListLoading.value && showReportList.value.length < 5);
      if (hasMoreReportList.value && !isReportListLoading.value && showReportList.value.length < 5) {
        isReportListLoading.value = true;
        getStationReportList();
      }
    });
    const getStationReportList = async () => {
      console.log("isGettingReport");
      api_index.api.getStationReportList({
        stationId,
        pageNum: reportListPageNum.value,
        pageSize: 5
      }).then((res) => {
        reportList.value = reportList.value.concat(
          res.data.data.filter((report) => {
            return report.status !== "Created" && report.status !== "None";
          }).map((report) => {
            return {
              // TODO: reportId还没有api 需要等待后端
              ...report,
              createTime: new Date(report.createTime),
              solvedTime: report.solvedTime ? new Date(report.solvedTime) : void 0
            };
          })
        );
        if (reportListPageNum.value * 5 >= res.data.total) {
          hasMoreReportList.value = false;
        } else {
          reportListPageNum.value++;
        }
        isReportListLoading.value = false;
        common_vendor.index.hideLoading();
      });
    };
    common_vendor.onReachBottom(() => {
      if (hasMoreReportList.value && !isReportListLoading.value) {
        isReportListLoading.value = true;
        getStationReportList();
      }
    });
    function handleClick(i) {
      common_vendor.index.navigateTo({
        url: "../handleReport/reportDetail/reportDetail",
        success: (res) => {
          res.eventChannel.emit("reportData", { data: showReportList.value[i] });
        }
      });
    }
    const managerReportSubscribeId = "PXbaC2t1IAQ8ILtPPre-iz3Nz2-F6kIGqJDn868o1_o";
    const isSubscribed = common_vendor.ref(false);
    const subscribeMessage = () => {
      common_vendor.index.requestSubscribeMessage({
        tmplIds: [managerReportSubscribeId],
        success: (res) => {
          if (res["errMsg"] !== "requestSubscribeMessage:ok" || res[managerReportSubscribeId] !== "accept") {
            common_vendor.index.showToast({
              title: "不订阅无法收到通知",
              icon: "none"
            });
            return;
          }
          if (!isSubscribed.value) {
            common_vendor.index.getSetting({
              withSubscriptions: true,
              success: (res2) => {
                if (res2.subscriptionsSetting.mainSwitch === false) {
                  common_vendor.index.showToast({
                    icon: "error",
                    title: "请允许消息通知",
                    duration: 1e4
                  });
                }
                if (res2.subscriptionsSetting[managerReportSubscribeId] === "accept") {
                  isSubscribed.value = true;
                }
              }
            });
          }
        },
        fail: (err) => {
          console.log("🚀 ~ file: handleReport.vue:165 ~ subscribeMessage ~ err:", err);
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !isSubscribed.value
      }, !isSubscribed.value ? {
        b: common_vendor.o(subscribeMessage)
      } : {}, {
        c: common_vendor.o(handleSelectChange),
        d: common_vendor.f(showReportList.value, (report, i, i0) => {
          var _a, _b;
          return common_vendor.e({
            a: report.photoUrlList[0],
            b: common_vendor.t(report.title),
            c: common_vendor.t(report.content),
            d: report.solvedTime && report.status === "Solved"
          }, report.solvedTime && report.status === "Solved" ? {
            e: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)(report.solvedTime))
          } : {}, {
            f: report.solvedTime && report.status === "Rejected"
          }, report.solvedTime && report.status === "Rejected" ? {
            g: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)(report.solvedTime))
          } : {}, {
            h: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)(report.createTime)),
            i: report.relatedPile
          }, report.relatedPile ? {} : {}, {
            j: common_vendor.t((_a = report.relatedPile) == null ? void 0 : _a.stationName),
            k: report.relatedPile
          }, report.relatedPile ? {
            l: common_vendor.t((_b = report.relatedPile) == null ? void 0 : _b.pileName)
          } : {}, {
            m: common_vendor.o(($event) => handleClick(i), i),
            n: i
          });
        }),
        e: common_vendor.p({
          ["is-loading"]: isReportListLoading.value,
          ["has-more"]: hasMoreReportList.value && showReportList.value.length > 5
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b7cb1cf1"]]);
wx.createPage(MiniProgramPage);
