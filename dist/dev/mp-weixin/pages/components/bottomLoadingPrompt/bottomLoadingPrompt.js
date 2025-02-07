"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "bottomLoadingPrompt",
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    hasMore: {
      type: Boolean,
      default: true
    },
    noData: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.noData
      }, __props.noData ? {} : __props.isLoading ? {} : !__props.hasMore ? {} : {}, {
        b: __props.isLoading,
        c: !__props.hasMore
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a1c3e480"]]);
wx.createComponent(Component);
