"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "reportTitle",
  setup(__props) {
    const reprtTitles = common_vendor.ref([
      { id: 0, context: "我的车被偷了" },
      { id: 0, context: "你的车我偷了" },
      { id: 0, context: "我的车被你偷了" },
      { id: 0, context: "你的车被我偷了" }
    ]);
    const handleSelect = (text) => {
      common_vendor.index.$emit("reportTitle", { reportTitle: text });
      common_vendor.index.navigateBack();
    };
    const enterClass = common_vendor.ref("enterClose");
    const arrowClass = common_vendor.ref("");
    const firstOpen = common_vendor.ref(true);
    const changeEnterClass = () => {
      if (firstOpen.value) {
        firstOpen.value = false;
      }
      if (enterClass.value === "enterOpen") {
        enterClass.value = "enterClose";
        arrowClass.value = "arrowNormal";
      } else {
        enterClass.value = "enterOpen";
        arrowClass.value = "arrowDown";
      }
    };
    const otherContext = common_vendor.ref("");
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(reprtTitles.value, (reprtTitle, index, i0) => {
          return {
            a: common_vendor.t(reprtTitle.context),
            b: index,
            c: common_vendor.o(($event) => handleSelect(reprtTitle.context), index)
          };
        }),
        b: common_vendor.n(arrowClass.value),
        c: common_vendor.o(changeEnterClass),
        d: !firstOpen.value
      }, !firstOpen.value ? {
        e: otherContext.value,
        f: common_vendor.o(($event) => otherContext.value = $event.detail.value),
        g: common_vendor.o(($event) => handleSelect(otherContext.value)),
        h: common_vendor.n(enterClass.value)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d3645b33"]]);
wx.createPage(MiniProgramPage);
