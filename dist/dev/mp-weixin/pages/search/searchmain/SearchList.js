"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_station = require("../../../api/station.js");
const utils_timeformatter = require("../../../utils/timeformatter.js");
require("../../../api/instance.js");
require("../../../api/index.js");
require("../../../api/scooter.js");
require("../../../api/login.js");
require("../../../api/user.js");
require("../../../api/report.js");
require("../../../api/chargehistory.js");
require("../../../api/track.js");
require("../../../api/news.js");
require("../../../api/banner.js");
require("../../../api/blacklist.js");
require("../../../utils/jwt.js");
require("../../../business/auth/useAuth.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "SearchList",
  props: {
    pileGroups: Array,
    free: Number,
    soon: Number
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(__props.free),
        b: common_vendor.t(__props.soon),
        c: common_vendor.f(__props.pileGroups, (pileGroup, index, i0) => {
          return {
            a: common_vendor.t(pileGroup.name),
            b: common_vendor.f(pileGroup.pileList, (pile, index2, i1) => {
              return common_vendor.e({
                a: common_vendor.t(pile.name),
                b: pile.status === common_vendor.unref(api_station.Status).Free || pile.status === common_vendor.unref(api_station.Status).Ended
              }, pile.status === common_vendor.unref(api_station.Status).Free || pile.status === common_vendor.unref(api_station.Status).Ended ? {} : {}, {
                c: pile.status === common_vendor.unref(api_station.Status).Using && !pile.isSoonFree
              }, pile.status === common_vendor.unref(api_station.Status).Using && !pile.isSoonFree ? {} : {}, {
                d: pile.isSoonFree
              }, pile.isSoonFree ? {} : {}, {
                e: pile.status === common_vendor.unref(api_station.Status).Using
              }, pile.status === common_vendor.unref(api_station.Status).Using ? {
                f: common_vendor.t(common_vendor.unref(utils_timeformatter.timeFormatter)(pile.end))
              } : {}, {
                g: common_vendor.t(pile.scooterCode),
                h: pile.scooterCode && (pile.status === common_vendor.unref(api_station.Status).Ended || pile.status === common_vendor.unref(api_station.Status).Free)
              }, pile.scooterCode && (pile.status === common_vendor.unref(api_station.Status).Ended || pile.status === common_vendor.unref(api_station.Status).Free) ? {} : {}, {
                i: index2
              });
            }),
            c: index
          };
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b98ba62e"]]);
wx.createComponent(Component);
