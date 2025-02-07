"use strict";
const common_vendor = require("../../../../common/vendor.js");
const api_index = require("../../../../api/index.js");
require("../../../../api/scooter.js");
require("../../../../api/instance.js");
require("../../../../utils/jwt.js");
require("../../../../business/auth/useAuth.js");
require("../../../../api/login.js");
require("../../../../api/user.js");
require("../../../../api/report.js");
require("../../../../api/chargehistory.js");
require("../../../../api/track.js");
require("../../../../api/news.js");
require("../../../../api/station.js");
require("../../../../api/banner.js");
require("../../../../api/blacklist.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "rejectReport",
  setup(__props) {
    const message = common_vendor.ref("");
    const reportId = common_vendor.ref();
    common_vendor.onLoad((options) => {
      reportId.value = options.reportId;
    });
    const handleClick = () => {
      if (!reportId.value) {
        common_vendor.index.showToast({ icon: "error", title: "参数错误" });
        common_vendor.index.navigateBack();
      }
      if (!message.value) {
        common_vendor.index.showToast({ icon: "error", title: "请填写原因" });
      }
      api_index.api.changeReportStatus(reportId.value, 2, message.value).catch((err) => {
        common_vendor.index.showToast({
          title: err.message,
          icon: "none"
        });
      });
    };
    return (_ctx, _cache) => {
      return {
        a: message.value,
        b: common_vendor.o(($event) => message.value = $event.detail.value),
        c: common_vendor.o(handleClick)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5bbee87f"]]);
wx.createPage(MiniProgramPage);
