"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "reportSuccess",
  setup(__props) {
    const stationName = common_vendor.ref("");
    const returnTo = () => {
      common_vendor.index.navigateBack({ delta: 2 });
    };
    common_vendor.onLoad((options) => {
      stationName.value = options.stationName;
      console.log(options);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(stationName.value),
        b: common_vendor.o(returnTo)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-29334861"]]);
wx.createPage(MiniProgramPage);
