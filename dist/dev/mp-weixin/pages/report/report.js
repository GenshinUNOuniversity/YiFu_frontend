"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
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
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "report",
  setup(__props) {
    const whichKind = common_vendor.ref("");
    const stationId = common_vendor.ref();
    const pileId = common_vendor.ref();
    const chargeHistoryDetail = common_vendor.ref();
    const stationName = common_vendor.ref("");
    const reportId = common_vendor.ref(0);
    common_vendor.onLoad((options) => {
      var _a, _b, _c;
      if (!options) {
        common_vendor.index.showModal({
          title: "警告",
          content: "非法操作",
          showCancel: false,
          success: function() {
            common_vendor.index.navigateBack();
          }
        });
        return;
      }
      if (options.whichKind === "pile") {
        whichKind.value = options.whichKind;
        stationId.value = Number(options.stationId);
        pileId.value = Number(options.pileId);
        common_vendor.index.showLoading({ title: "加载中" });
        getPileDetail({ stationId: stationId.value, pileId: pileId.value });
      } else if (options.whichKind === "chargeHistory") {
        whichKind.value = options.whichKind;
        chargeHistoryDetail.value = {
          ...JSON.parse(options.chargeHistory),
          begin: new Date(JSON.parse(options.chargeHistory).begin),
          end: JSON.parse(options.chargeHistory).end ? new Date(JSON.parse(options.chargeHistory).end) : void 0
        };
        stationName.value = ((_a = chargeHistoryDetail.value) == null ? void 0 : _a.stationName) ?? "";
        stationId.value = (_b = chargeHistoryDetail.value) == null ? void 0 : _b.stationId;
      } else if (options.whichKind === "stationId") {
        whichKind.value = options.whichKind;
        stationName.value = options.stationName;
        stationId.value = Number(options.stationId);
      } else {
        common_vendor.index.showModal({
          title: "警告",
          content: "非法操作",
          showCancel: false,
          success: function() {
            common_vendor.index.navigateBack();
          }
        });
      }
      if (stationId.value) {
        api_index.api.createReport({
          stationId: stationId.value,
          relatedPileId: pileId.value,
          relatedChargeHistoryId: (_c = chargeHistoryDetail.value) == null ? void 0 : _c.chargeHistoryId
        }).then((res) => {
          reportId.value = res.data.reportId;
          console.log(reportId.value);
        });
      }
    });
    const statusFormatter = (status) => {
      switch (status) {
        case "Ended":
          return "已结束";
        case "Free":
          return "空闲";
        case "Using":
          return "正在充电";
        case "EndedByOther":
          return "被确认充满";
        case "EndedBySelf":
          return "已充满";
        case "EndedPeacefully":
          return "正常到时间结束";
        default:
          return "未知情况";
      }
    };
    const pileDetail = common_vendor.ref();
    const getPileDetail = async ({ stationId: stationId2, pileId: pileId2 }) => {
      api_index.api.getPileInfo({ stationId: stationId2, pileId: pileId2 }).then((res) => {
        pileDetail.value = res.data;
        common_vendor.index.hideLoading();
      });
    };
    const chargeSpread = () => {
      isSpread.value = !isSpread.value;
    };
    const reportContext = common_vendor.ref("");
    const reportPhotos = common_vendor.ref([]);
    const chooseImages = () => {
      common_vendor.index.chooseImage({
        sizeType: ["compressed"],
        success: function(res) {
          console.log(res);
          if (!reportPhotos.value) {
            if (Array.isArray(res.tempFilePaths)) {
              reportPhotos.value = res.tempFilePaths;
            } else {
              reportPhotos.value = [res.tempFilePaths];
            }
          } else {
            reportPhotos.value = reportPhotos.value.concat(res.tempFilePaths);
          }
        }
      });
    };
    const previewImage = (url) => {
      common_vendor.index.navigateTo({
        url: "/pages/components/previewPhoto/previewPhoto",
        success: (res) => {
          res.eventChannel.emit("previewPhotoUrl", { photoUrl: url });
        }
      });
      common_vendor.index.$once("deleteUrl", (data) => {
        var _a;
        reportPhotos.value = (_a = reportPhotos.value) == null ? void 0 : _a.filter((url2) => url2 !== data.deleteUrl);
      });
    };
    const reportTitle = common_vendor.ref();
    const startSelectTitle = () => {
      common_vendor.index.navigateTo({ url: "/pages/report/reportTitle/reportTitle" });
      common_vendor.index.$once("reportTitle", (data) => {
        reportTitle.value = data.reportTitle;
        console.log(data);
      });
    };
    const reportSubscribeId = "1mdcWLE_Mb5yySKVkujLd6Qg1TX2a4xa8ZF7Md-13R0";
    const subscribeMessage = () => {
      return new Promise((resole, reject) => {
        common_vendor.index.requestSubscribeMessage({
          tmplIds: [reportSubscribeId],
          success: (res) => {
            if (res["errMsg"] === "requestSubscribeMessage:ok" || res[reportSubscribeId] === "accept") {
              resole(true);
            }
            common_vendor.index.showToast({
              title: "不订阅无法收到举报处理后的通知",
              icon: "none"
            });
            reject();
            return;
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    };
    const addReportContent = async () => {
      try {
        await subscribeMessage();
        if (reportPhotos.value.length === 0) {
          common_vendor.index.showToast({
            title: "请提交举报照片",
            icon: "error"
          });
          return;
        }
        common_vendor.index.showLoading({ title: "提交中" });
        reportPhotos.value.forEach(async (path) => {
          await api_index.api.addReportPhoto(reportId.value, path);
          console.log("tijiao");
        });
        await api_index.api.addReportContent({ content: reportContext.value, title: reportTitle.value }, reportId.value);
        console.log("kaishitijiao");
        api_index.api.commitReport(reportId.value).then(async (res) => {
          console.log(res);
          common_vendor.index.hideLoading();
          common_vendor.index.navigateTo({ url: `./reportSuccess/reportSuccess?stationName=${stationName.value}` });
        }).catch((err) => {
          console.log(err);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: err.message,
            icon: "none"
          });
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        console.error(error);
      }
    };
    const detailClass = common_vendor.ref("");
    const isSpread = common_vendor.ref(true);
    const changeDetailClass = () => {
      if (isSpread.value) {
        isSpread.value = false;
      }
      if (detailClass.value === "detailOpen") {
        detailClass.value = "detailClose";
        setTimeout(() => {
          isSpread.value = true;
        }, 750);
      } else {
        detailClass.value = "detailOpen";
      }
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
      return common_vendor.e({
        a: whichKind.value === "chargeHistory"
      }, whichKind.value === "chargeHistory" ? common_vendor.e({
        b: common_vendor.t(common_vendor.unref(utils_timeformatter.dateFormatter)((_a = chargeHistoryDetail.value) == null ? void 0 : _a.begin)),
        c: common_vendor.t((_b = chargeHistoryDetail.value) == null ? void 0 : _b.stationName),
        d: common_vendor.t((_c = chargeHistoryDetail.value) == null ? void 0 : _c.pileName),
        e: common_vendor.t(statusFormatter((_d = chargeHistoryDetail.value) == null ? void 0 : _d.status)),
        f: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)((_e = chargeHistoryDetail.value) == null ? void 0 : _e.begin)),
        g: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)((_f = chargeHistoryDetail.value) == null ? void 0 : _f.end)),
        h: !isSpread.value
      }, !isSpread.value ? common_vendor.e({
        i: (_g = chargeHistoryDetail.value) == null ? void 0 : _g.endPhotoUrl
      }, ((_h = chargeHistoryDetail.value) == null ? void 0 : _h.endPhotoUrl) ? {
        j: (_i = chargeHistoryDetail.value) == null ? void 0 : _i.endPhotoUrl
      } : {}, {
        k: (_j = chargeHistoryDetail.value) == null ? void 0 : _j.moveDesc
      }, ((_k = chargeHistoryDetail.value) == null ? void 0 : _k.moveDesc) ? {
        l: common_vendor.t((_l = chargeHistoryDetail.value) == null ? void 0 : _l.moveDesc)
      } : {}, {
        m: (_m = chargeHistoryDetail.value) == null ? void 0 : _m.movePhotoUrl
      }, ((_n = chargeHistoryDetail.value) == null ? void 0 : _n.movePhotoUrl) ? {
        n: (_o = chargeHistoryDetail.value) == null ? void 0 : _o.movePhotoUrl
      } : {}, {
        o: common_vendor.o(changeDetailClass),
        p: common_vendor.n(detailClass.value),
        q: common_vendor.o(chargeSpread)
      }) : {
        r: common_vendor.o(changeDetailClass)
      }) : {}, {
        s: whichKind.value === "pile"
      }, whichKind.value === "pile" ? common_vendor.e({
        t: common_vendor.t((_p = pileDetail.value) == null ? void 0 : _p.name),
        v: common_vendor.t((_q = pileDetail.value) == null ? void 0 : _q.scooterCode),
        w: common_vendor.t(statusFormatter(pileDetail.value.status)),
        x: pileDetail.value.status === "Using"
        /* Using */
      }, pileDetail.value.status === "Using" ? {
        y: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)((_r = chargeHistoryDetail.value) == null ? void 0 : _r.begin)),
        z: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)((_s = chargeHistoryDetail.value) == null ? void 0 : _s.end))
      } : {}) : {}, {
        A: whichKind.value === "stationId"
      }, whichKind.value === "stationId" ? {
        B: common_vendor.t(stationName.value)
      } : {}, {
        C: common_vendor.t(reportTitle.value ?? "未选择"),
        D: reportTitle.value ? "black" : "#9e9e9e",
        E: common_vendor.o(startSelectTitle),
        F: -1,
        G: reportContext.value,
        H: common_vendor.o(($event) => reportContext.value = $event.detail.value),
        I: common_vendor.f(reportPhotos.value, (filepath, index, i0) => {
          return {
            a: index,
            b: filepath,
            c: common_vendor.o(($event) => previewImage(filepath), index)
          };
        }),
        J: common_vendor.o(chooseImages),
        K: common_vendor.t(stationName.value),
        L: common_vendor.o(addReportContent)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e12457dc"]]);
wx.createPage(MiniProgramPage);
