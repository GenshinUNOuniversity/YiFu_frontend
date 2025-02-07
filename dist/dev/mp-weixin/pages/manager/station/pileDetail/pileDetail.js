"use strict";
const common_vendor = require("../../../../common/vendor.js");
const api_index = require("../../../../api/index.js");
const api_station = require("../../../../api/station.js");
const utils_timeformatter = require("../../../../utils/timeformatter.js");
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
require("../../../../api/banner.js");
require("../../../../api/blacklist.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "pileDetail",
  setup(__props) {
    const pileId = common_vendor.ref();
    const stationId = common_vendor.ref();
    const pileInfo = common_vendor.ref();
    const pileStatusFormatter = (pile) => {
      if (pile.isSoonFree) {
        return "即将充满";
      }
      switch (pile.status) {
        case api_station.Status.Repairing:
          return "正在维修";
        case api_station.Status.Using:
          return "正在使用";
        case api_station.Status.Free:
          return "空闲";
        case api_station.Status.Ended:
          return "空闲";
      }
    };
    function forceFinish() {
      var _a;
      common_vendor.index.showModal({
        title: "强制结束",
        content: `确定要强制结束${(_a = pileInfo.value) == null ? void 0 : _a.scooterCode}充电吗`,
        success: function(res) {
          var _a2, _b;
          if (res.confirm) {
            if (!((_a2 = pileInfo.value) == null ? void 0 : _a2.scooterId)) {
              return;
            }
            api_index.api.endChargeScooter({ scooterId: (_b = pileInfo.value) == null ? void 0 : _b.scooterId }).then((res2) => {
              common_vendor.index.showToast({
                title: "强制结束成功",
                icon: "success",
                duration: 2e3
              });
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 2e3);
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
    common_vendor.onLoad((options) => {
      pileId.value = options == null ? void 0 : options.pileId;
      stationId.value = common_vendor.index.getStorageSync("stationId");
      if (!stationId.value || !pileId.value) {
        return;
      }
      api_index.api.getPileInfo({ stationId: stationId.value, pileId: pileId.value }).then((res) => {
        pileInfo.value = {
          ...res.data,
          begin: res.data.begin ? new Date(res.data.begin) : void 0,
          end: res.data.end ? new Date(res.data.end) : void 0
        };
      });
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
      return common_vendor.e({
        a: common_vendor.t((_a = pileInfo.value) == null ? void 0 : _a.name),
        b: (_b = pileInfo.value) == null ? void 0 : _b.desc
      }, ((_c = pileInfo.value) == null ? void 0 : _c.desc) ? {
        c: common_vendor.t((_d = pileInfo.value) == null ? void 0 : _d.desc)
      } : {}, {
        d: common_vendor.t(pileStatusFormatter(pileInfo.value)),
        e: (_e = pileInfo.value) == null ? void 0 : _e.scooterCode
      }, ((_f = pileInfo.value) == null ? void 0 : _f.scooterCode) ? {
        f: common_vendor.t((_g = pileInfo.value) == null ? void 0 : _g.scooterCode)
      } : {}, {
        g: (_h = pileInfo.value) == null ? void 0 : _h.begin
      }, ((_i = pileInfo.value) == null ? void 0 : _i.begin) ? {
        h: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)((_j = pileInfo.value) == null ? void 0 : _j.begin))
      } : {}, {
        i: (_k = pileInfo.value) == null ? void 0 : _k.end
      }, ((_l = pileInfo.value) == null ? void 0 : _l.end) ? {
        j: common_vendor.t(pileInfo.value.status === common_vendor.unref(api_station.Status).Using ? "预计结束" : "结束"),
        k: common_vendor.t(common_vendor.unref(utils_timeformatter.dateTimeFormatter)((_m = pileInfo.value) == null ? void 0 : _m.end))
      } : {}, {
        l: (_n = pileInfo.value) == null ? void 0 : _n.endDesc
      }, ((_o = pileInfo.value) == null ? void 0 : _o.endDesc) ? {
        m: common_vendor.t((_p = pileInfo.value) == null ? void 0 : _p.endDesc)
      } : {}, {
        n: ((_q = pileInfo.value) == null ? void 0 : _q.status) === common_vendor.unref(api_station.Status).Using
      }, ((_r = pileInfo.value) == null ? void 0 : _r.status) === common_vendor.unref(api_station.Status).Using ? {
        o: common_vendor.t((_s = pileInfo.value) == null ? void 0 : _s.scooterCode),
        p: common_vendor.o(forceFinish)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8b1fdf1c"]]);
wx.createPage(MiniProgramPage);
