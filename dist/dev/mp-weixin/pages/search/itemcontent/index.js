"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "Itemcontent",
  components: {},
  setup() {
    const back = function() {
      common_vendor.index.switchTab({
        url: "../index"
      });
    };
    return { back };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $setup.back && $setup.back(...args))
  }, {}, {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-44367408"]]);
wx.createPage(MiniProgramPage);
