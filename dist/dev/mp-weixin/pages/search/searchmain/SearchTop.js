"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "SearchTop",
  props: {
    name: String,
    distance: String,
    desc: String
  },
  setup(__props) {
    const prop = __props;
    const back = () => {
      common_vendor.index.navigateBack();
    };
    const showNote = () => {
      common_vendor.index.showModal({ title: "阿姨的温馨提示", showCancel: false, content: prop.desc });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.name),
        b: common_vendor.o(back),
        c: common_vendor.t(__props.distance),
        d: common_vendor.t(__props.desc),
        e: common_vendor.o(showNote)
      }, {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3a9634a9"]]);
wx.createComponent(Component);
