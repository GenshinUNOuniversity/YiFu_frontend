"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const api_station = require("../../../api/station.js");
const utils_timeformatter = require("../../../utils/timeformatter.js");
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
require("../../../api/banner.js");
require("../../../api/blacklist.js");
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  const _component_uni_list_item = common_vendor.resolveComponent("uni-list-item");
  const _component_uni_list = common_vendor.resolveComponent("uni-list");
  const _component_uni_section = common_vendor.resolveComponent("uni-section");
  (_component_uni_icons + _component_uni_list_item + _component_uni_list + _component_uni_section)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "station",
  setup(__props) {
    const stationInfo = common_vendor.ref();
    const stationId = common_vendor.ref();
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
    const handleClick = (pileId) => {
      common_vendor.index.navigateTo({
        url: `./pileDetail/pileDetail?pileId=${pileId}`
        //url:'./pileDetail/pileDetail'
      });
    };
    common_vendor.onShow(async () => {
      try {
        stationId.value = common_vendor.index.getStorageSync("stationId");
        stationInfo.value = (await api_index.api.getStationInfo({ stationId: stationId.value })).data;
        stationInfo.value = {
          ...stationInfo.value,
          pileGroupList: stationInfo.value.pileGroupList.map((pileGroup) => ({
            ...pileGroup,
            isShow: true,
            pileList: pileGroup.pileList.map((pile) => ({
              ...pile,
              begin: pile.begin ? new Date(pile.begin) : void 0,
              end: pile.end ? new Date(pile.end) : void 0
            }))
          }))
        };
        common_vendor.index.setNavigationBarTitle({
          title: stationInfo.value.name
        });
        console.log(stationInfo.value);
      } catch (error) {
        console.log(error);
      }
    });
    const thumbPicFormatter = (status, isSoonFree) => {
      if (isSoonFree)
        return "/static/chargingstationSoonFree.svg";
      switch (status) {
        case api_station.Status.Repairing:
          return "/static/chargingstation.svg";
        case api_station.Status.Using:
          return "/static/chargingstationUse.svg";
        case api_station.Status.Free:
          return "/static/chargingstationGreen.svg";
        case api_station.Status.Ended:
          return "/static/chargingstationGreen.svg";
      }
    };
    return (_ctx, _cache) => {
      var _a;
      return {
        a: common_vendor.f((_a = stationInfo.value) == null ? void 0 : _a.pileGroupList, (pileStation, index, i0) => {
          return common_vendor.e({
            a: !pileStation.isShow
          }, !pileStation.isShow ? {
            b: "7fed04bb-1-" + i0 + "," + ("7fed04bb-0-" + i0),
            c: common_vendor.p({
              type: "forward",
              size: "24"
            })
          } : {
            d: "7fed04bb-2-" + i0 + "," + ("7fed04bb-0-" + i0),
            e: common_vendor.p({
              type: "bottom",
              size: "24"
            })
          }, {
            f: pileStation.isShow
          }, pileStation.isShow ? {
            g: common_vendor.f(pileStation.pileList, (pile, index2, i1) => {
              return common_vendor.e({
                a: common_vendor.t(pile.name),
                b: pile.scooterCode
              }, pile.scooterCode ? {
                c: common_vendor.t(pile.scooterCode),
                d: common_vendor.t(pile.status === common_vendor.unref(api_station.Status).Using ? "正在使用" : "使用结束")
              } : {
                e: common_vendor.t(pileStatusFormatter(pile))
              }, {
                f: pile.begin
              }, pile.begin ? {
                g: common_vendor.t(common_vendor.unref(utils_timeformatter.timeFormatter)(pile.begin))
              } : {}, {
                h: pile.end
              }, pile.end ? {
                i: common_vendor.t(pile.status === common_vendor.unref(api_station.Status).Using ? "预计结束" : "结束"),
                j: common_vendor.t(common_vendor.unref(utils_timeformatter.timeFormatter)(pile.end))
              } : {}, {
                k: index2,
                l: common_vendor.o(($event) => handleClick(pile.pileId), index2),
                m: "7fed04bb-4-" + i0 + "-" + i1 + "," + ("7fed04bb-3-" + i0),
                n: common_vendor.p({
                  thumb: thumbPicFormatter(pile.status, pile.isSoonFree),
                  ["thumb-size"]: "base",
                  ["show-arrow"]: true,
                  clickable: true
                })
              });
            }),
            h: "7fed04bb-3-" + i0 + "," + ("7fed04bb-0-" + i0)
          } : {}, {
            i: common_vendor.o(($event) => pileStation.isShow = !pileStation.isShow, index),
            j: "7fed04bb-0-" + i0,
            k: common_vendor.p({
              title: pileStation.name,
              type: "line",
              ["title-font-size"]: "24px"
            }),
            l: index
          });
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7fed04bb"]]);
wx.createPage(MiniProgramPage);
