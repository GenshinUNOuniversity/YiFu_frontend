"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "StartCharging",
  components: {},
  props: {},
  data() {
    return {
      time: "22:30"
    };
  },
  computed: {},
  watch: {},
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.time)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f02f438d"]]);
wx.createPage(MiniProgramPage);
