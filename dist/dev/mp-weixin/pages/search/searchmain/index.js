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
  (SearchTop + SearchList)();
}
const SearchTop = () => "./SearchTop.js";
const SearchList = () => "./SearchList.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const stationId = common_vendor.ref(0);
    const stationInfo = common_vendor.ref();
    const pileGroups = common_vendor.ref([]);
    const name = common_vendor.ref("");
    const distance = common_vendor.ref("");
    common_vendor.onLoad((options) => {
      stationId.value = parseInt(options.id ?? "0", 10);
      name.value = options.name ?? "";
      distance.value = options.distance ?? "距离 —— 千米";
      if (stationId.value !== 0) {
        api_index.api.getStationInfo({
          stationId: stationId.value
        }).then((res) => {
          stationInfo.value = res.data;
          pileGroups.value = res.data.pileGroupList.map((pileGroup) => {
            return {
              ...pileGroup,
              pileList: pileGroup.pileList.map((p) => {
                return {
                  ...p,
                  end: p.end ? new Date(p.end) : void 0
                };
              })
            };
          });
        });
      }
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e;
      return {
        a: common_vendor.p({
          name: name.value,
          distance: distance.value,
          desc: (_a = stationInfo.value) == null ? void 0 : _a.desc
        }),
        b: common_vendor.p({
          ["pile-groups"]: pileGroups.value,
          free: (_c = (_b = stationInfo.value) == null ? void 0 : _b.stat) == null ? void 0 : _c.free,
          soon: (_e = (_d = stationInfo.value) == null ? void 0 : _d.stat) == null ? void 0 : _e.soon
        })
      };
    };
  }
});
wx.createPage(_sfc_main);
