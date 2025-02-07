"use strict";
const common_vendor = require("../../../../common/vendor.js");
const api_index = require("../../../../api/index.js");
const api_report = require("../../../../api/report.js");
const utils_timeformatter = require("../../../../utils/timeformatter.js");
require("../../../../api/scooter.js");
require("../../../../api/instance.js");
require("../../../../utils/jwt.js");
require("../../../../business/auth/useAuth.js");
require("../../../../api/login.js");
require("../../../../api/user.js");
require("../../../../api/chargehistory.js");
require("../../../../api/track.js");
require("../../../../api/news.js");
require("../../../../api/station.js");
require("../../../../api/banner.js");
require("../../../../api/blacklist.js");
if (!Math) {
  (addBlackListBottom + AddBlackListWithType)();
}
const AddBlackListWithType = () => "../../../components/addBlackListWithType/addBlackListWithType.js";
const addBlackListBottom = () => "../../../components/addBlackListBottom/addBlackListBottom.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "reportDetail",
  setup(__props) {
    const previewPhoto = (url) => {
      if (url === "" || url === null) {
        return;
      }
      common_vendor.index.previewImage({
        urls: [url]
      });
    };
    common_vendor.onShow(() => {
      var _a;
      const instance = (_a = common_vendor.getCurrentInstance()) == null ? void 0 : _a.proxy;
      const eventChannel = instance.getOpenerEventChannel();
      eventChannel.once("reportData", (data) => {
        reportDetail.value = data.data;
        console.log(reportDetail.value);
      });
    });
    const reportDetail = common_vendor.ref();
    const statusColor = (status) => {
      switch (status) {
        case "Created":
          return "red";
        case "Committed":
          return "orange";
        case "Rejected":
          return "red";
        case "Solved":
          return "green";
        default:
          return "black";
      }
    };
    const statusFormatter = (status) => {
      switch (status) {
        case "Created":
          return "已创建";
        case "Committed":
          return "已提交";
        case "Rejected":
          return "已驳回";
        case "Solved":
          return "已处理";
        default:
          return "未知状态";
      }
    };
    const subscribeId = "PXbaC2t1IAQ8ILtPPre-iz3Nz2-F6kIGqJDn868o1_o";
    const isShowAddBlackListWithType = common_vendor.ref(false);
    const showType = () => {
      isShowAddBlackListWithType.value = !isShowAddBlackListWithType.value;
    };
    const handleReportStatusChange = (pass) => {
      common_vendor.index.showModal({
        title: pass ? "通过此举报" : "驳回此举报",
        editable: true,
        placeholderText: "请输入处理理由",
        showCancel: true,
        success: ({ confirm, cancel, content }) => {
          var _a, _b;
          if (cancel) {
            return;
          } else if (!content) {
            common_vendor.index.showToast({
              title: "请输入处理理由",
              icon: "error",
              duration: 2e3
            });
          } else if (confirm) {
            if (!((_a = reportDetail.value) == null ? void 0 : _a.id)) {
              return;
            }
            api_index.api.changeReportStatus((_b = reportDetail.value) == null ? void 0 : _b.id, pass ? 1 : 2, content).then(() => {
              reportDetail.value = {
                ...reportDetail.value,
                status: pass ? api_report.reportStatus.Solved : api_report.reportStatus.Rejected,
                solvedReply: content,
                solvedTime: /* @__PURE__ */ new Date()
              };
              common_vendor.index.showToast({
                title: "通过成功",
                icon: "success",
                duration: 2e3
              });
              common_vendor.index.requestSubscribeMessage({
                tmplIds: ["PXbaC2t1IAQ8ILtPPre-iz3Nz2-F6kIGqJDn868o1_o"],
                success: (res) => {
                  if (res.errMsg !== "requestSubscribeMessage:ok" && res[subscribeId] !== "accept") {
                    common_vendor.index.showToast({
                      title: "不订阅无法收到通知",
                      icon: "none"
                    });
                    return;
                  }
                }
              });
            }).catch((err) => {
              common_vendor.index.showToast({
                title: err.message,
                icon: "none"
              });
            });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C;
      return common_vendor.e({
        a: common_vendor.t(statusFormatter((_a = reportDetail.value) == null ? void 0 : _a.status)),
        b: statusColor((_b = reportDetail.value) == null ? void 0 : _b.status),
        c: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)((_c = reportDetail.value) == null ? void 0 : _c.createTime)),
        d: (_d = reportDetail.value) == null ? void 0 : _d.relatedPile
      }, ((_e = reportDetail.value) == null ? void 0 : _e.relatedPile) ? {
        e: common_vendor.t(reportDetail.value.relatedPile.pileName + " 充电桩 " + ((_f = reportDetail.value.relatedPile) == null ? void 0 : _f.stationName))
      } : {}, {
        f: common_vendor.t((_g = reportDetail.value) == null ? void 0 : _g.title),
        g: common_vendor.t((_h = reportDetail.value) == null ? void 0 : _h.content),
        h: common_vendor.f((_i = reportDetail.value) == null ? void 0 : _i.photoUrlList, (photoUrl, index, i0) => {
          return {
            a: index,
            b: photoUrl
          };
        }),
        i: ((_j = reportDetail.value) == null ? void 0 : _j.status) === "Committed"
      }, ((_k = reportDetail.value) == null ? void 0 : _k.status) === "Committed" ? common_vendor.e({
        j: reportDetail.value.relatedChargeHistory
      }, reportDetail.value.relatedChargeHistory ? common_vendor.e({
        k: common_vendor.t(reportDetail.value.relatedChargeHistory.stationName),
        l: common_vendor.t(reportDetail.value.relatedChargeHistory.pileName),
        m: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)(new Date(reportDetail.value.relatedChargeHistory.begin))),
        n: common_vendor.t(statusFormatter(reportDetail.value.relatedChargeHistory.status)),
        o: reportDetail.value.relatedChargeHistory.status === "Using" ? "#056334" : "rgba(0, 0, 0, 0.4)",
        p: reportDetail.value.relatedChargeHistory.status !== "Using"
      }, reportDetail.value.relatedChargeHistory.status !== "Using" ? {
        q: reportDetail.value.relatedChargeHistory.endPhotoUrl,
        r: common_vendor.o(($event) => {
          var _a2, _b2;
          return previewPhoto((_b2 = (_a2 = reportDetail.value) == null ? void 0 : _a2.relatedChargeHistory) == null ? void 0 : _b2.endPhotoUrl);
        }),
        s: reportDetail.value.relatedChargeHistory.movePhotoUrl,
        t: common_vendor.o(($event) => {
          var _a2, _b2;
          return previewPhoto((_b2 = (_a2 = reportDetail.value) == null ? void 0 : _a2.relatedChargeHistory) == null ? void 0 : _b2.movePhotoUrl);
        }),
        v: common_vendor.t(reportDetail.value.relatedChargeHistory.moveDesc ? reportDetail.value.relatedChargeHistory.moveDesc : "无移车备注")
      } : {}, {
        w: common_vendor.t(reportDetail.value.relatedChargeHistory.scooterCode),
        x: reportDetail.value.relatedChargeHistory.end
      }, reportDetail.value.relatedChargeHistory.end ? {
        y: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)(new Date(reportDetail.value.relatedChargeHistory.end)))
      } : {
        z: common_vendor.t(reportDetail.value.relatedChargeHistory.expectHour)
      }) : {}, {
        A: common_vendor.o(($event) => handleReportStatusChange(false)),
        B: common_vendor.o(($event) => handleReportStatusChange(true))
      }) : {}, {
        C: ((_l = reportDetail.value) == null ? void 0 : _l.status) === "Rejected" || ((_m = reportDetail.value) == null ? void 0 : _m.status) === "Solved"
      }, ((_n = reportDetail.value) == null ? void 0 : _n.status) === "Rejected" || ((_o = reportDetail.value) == null ? void 0 : _o.status) === "Solved" ? {
        D: common_vendor.t(reportDetail.value.solvedReply),
        E: ((_p = reportDetail.value) == null ? void 0 : _p.status) === "Solved" ? 1 : "",
        F: !(((_q = reportDetail.value) == null ? void 0 : _q.status) === "Rejected") ? 1 : "",
        G: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)(reportDetail.value.solvedTime)),
        H: ((_r = reportDetail.value) == null ? void 0 : _r.status) === "Solved" ? 1 : "",
        I: !(((_s = reportDetail.value) == null ? void 0 : _s.status) === "Rejected") ? 1 : ""
      } : {}, {
        J: (_t = reportDetail.value) == null ? void 0 : _t.relatedChargeHistory
      }, ((_u = reportDetail.value) == null ? void 0 : _u.relatedChargeHistory) ? {
        K: common_vendor.p({
          ["scooter-code"]: (_w = (_v = reportDetail.value) == null ? void 0 : _v.relatedChargeHistory) == null ? void 0 : _w.scooterCode
        }),
        L: common_vendor.p({
          ["user-id"]: (_y = (_x = reportDetail.value) == null ? void 0 : _x.relatedChargeHistory) == null ? void 0 : _y.endUserId
        })
      } : {}, {
        M: !isShowAddBlackListWithType.value
      }, !isShowAddBlackListWithType.value ? {
        N: common_vendor.o(showType)
      } : {}, {
        O: !(((_z = reportDetail.value) == null ? void 0 : _z.status) === "Created" || ((_A = reportDetail.value) == null ? void 0 : _A.status) === "None") && isShowAddBlackListWithType.value
      }, !(((_B = reportDetail.value) == null ? void 0 : _B.status) === "Created" || ((_C = reportDetail.value) == null ? void 0 : _C.status) === "None") && isShowAddBlackListWithType.value ? {
        P: common_vendor.p({
          id: "type"
        })
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e1705a6f"]]);
wx.createPage(MiniProgramPage);
