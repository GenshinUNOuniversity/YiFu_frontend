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
    const dateFormatter = (date) => {
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    };
    const reports = common_vendor.ref([]);
    const reportListPageNum = common_vendor.ref(1);
    const isReportListLoading = common_vendor.ref(false);
    const hasMoreReportList = common_vendor.ref(true);
    const getReportList = async () => {
      api_index.api.getPersonalReportList({ pageNum: reportListPageNum.value, pageSize: 10 }).then((res) => {
        reports.value = reports.value.concat(
          res.data.data.filter((report) => {
            return report.status !== "None" && report.status !== "Created";
          }).map((report) => {
            report.createTime = new Date(report.createTime);
            if (report.solvedTime) {
              report.solvedTime = new Date(report.solvedTime);
            }
            return report;
          })
        );
        if (reports.value.length === 0) {
          common_vendor.index.showModal({
            title: "暂无举报记录",
            content: "你还没有举报哦。",
            showCancel: false,
            success: () => {
              common_vendor.index.navigateBack();
            }
          });
        }
        if (reportListPageNum.value * 5 >= res.data.total) {
          hasMoreReportList.value = false;
        } else {
          reportListPageNum.value++;
        }
        isReportListLoading.value = false;
        common_vendor.index.hideLoading();
      }).catch((err) => {
        console.error(err);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: err.data.message,
          icon: "error"
        });
      });
    };
    common_vendor.onReachBottom(() => {
      if (hasMoreReportList.value && !isReportListLoading.value) {
        isReportListLoading.value = true;
        getReportList();
      }
    });
    common_vendor.onLoad(() => {
      common_vendor.index.showLoading({
        title: "加载中"
      });
      getReportList();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(reports.value, (report, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(report.title),
            b: common_vendor.t(dateFormatter(report.createTime)),
            c: common_vendor.t(report.solvedTime ? "已结束" : "处理中"),
            d: report.solvedTime ? "rgba(0, 0, 0, 0.4)" : "#ed7b2f",
            e: common_vendor.t(report.content),
            f: common_vendor.f(report.photoUrlList, (photoUrl, index, i1) => {
              return {
                a: index,
                b: photoUrl,
                c: common_vendor.o(($event) => previewPhoto(photoUrl), index)
              };
            }),
            g: report.solvedTime
          }, report.solvedTime ? {
            h: common_vendor.t(report.solvedReply),
            i: common_vendor.t(dateFormatter(report.solvedTime))
          } : {}, {
            j: Number(report.createTime)
          });
        }),
        b: common_vendor.p({
          ["has-more"]: hasMoreReportList.value,
          ["is-loading"]: isReportListLoading.value
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-411e662e"]]);
wx.createPage(MiniProgramPage);
