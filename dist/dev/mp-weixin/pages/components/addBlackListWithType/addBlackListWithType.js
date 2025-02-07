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
if (!Array) {
  const _component_uni_datetime_picker = common_vendor.resolveComponent("uni-datetime-picker");
  _component_uni_datetime_picker();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "addBlackListWithType",
  setup(__props) {
    const due = common_vendor.ref((/* @__PURE__ */ new Date()).getTime());
    const scooterCode = common_vendor.ref("");
    const reason = common_vendor.ref("");
    const codeRegular = /^[A-Z]\d{1,4}$/;
    const sendToBlackList = () => {
      if (!codeRegular.test(scooterCode.value)) {
        common_vendor.index.showToast({ title: "电动车编号错误", icon: "error" });
        return;
      } else if (!reason.value) {
        common_vendor.index.showToast({ title: "请输入原因", icon: "error" });
        return;
      } else if (due.value < (/* @__PURE__ */ new Date()).getTime()) {
        common_vendor.index.showToast({ title: "解封时间不能早于当前时间" });
        return;
      }
      api_index.api.sendToBlackList(reason.value, due.value, void 0, void 0, scooterCode.value).then(() => {
        common_vendor.index.showToast({ title: "添加成功", icon: "success" });
      }).catch((err) => {
        common_vendor.index.showToast({
          title: err.message,
          icon: "error"
        });
      });
    };
    return (_ctx, _cache) => {
      return {
        a: scooterCode.value,
        b: common_vendor.o(($event) => scooterCode.value = $event.detail.value),
        c: reason.value,
        d: common_vendor.o(($event) => reason.value = $event.detail.value),
        e: common_vendor.o(($event) => due.value = $event),
        f: common_vendor.p({
          ["return-type"]: "timestamp",
          modelValue: due.value
        }),
        g: common_vendor.o(sendToBlackList)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9d01b5ff"]]);
wx.createComponent(Component);
