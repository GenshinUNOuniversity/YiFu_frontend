"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_location = require("../../utils/location.js");
const utils_status = require("../../utils/status.js");
require("../../api/scooter.js");
require("../../api/instance.js");
require("../../utils/jwt.js");
require("../../business/auth/useAuth.js");
require("../../api/login.js");
require("../../api/user.js");
require("../../api/report.js");
require("../../api/chargehistory.js");
require("../../api/track.js");
require("../../api/news.js");
require("../../api/station.js");
require("../../api/banner.js");
require("../../api/blacklist.js");
if (!Math) {
  BottomLoadingPrompt();
}
const BottomLoadingPrompt = () => "../components/bottomLoadingPrompt/bottomLoadingPrompt.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const isComplete = common_vendor.ref(false);
    const latitude = common_vendor.ref(0);
    const longitude = common_vendor.ref(0);
    const polygons = common_vendor.ref([]);
    const markers = common_vendor.ref([]);
    const arrange = (arr) => {
      let total = 0;
      arr.forEach((item) => {
        total = item + total;
      });
      console.log(total / arr.length);
      return total / arr.length;
    };
    const stationList = common_vendor.ref([]);
    const isActive = common_vendor.ref(false);
    const isNeedUpdateProfile = common_vendor.ref(common_vendor.index.getStorageSync("needUpdateProfile"));
    const scooterStatus = common_vendor.ref(utils_status.UserScooterStatus.None);
    common_vendor.onShow(async () => {
      if (common_vendor.index.getStorageSync("status") === "None") {
        isActive.value = false;
      } else {
        isActive.value = true;
      }
      isNeedUpdateProfile.value = common_vendor.index.getStorageSync("needUpdateProfile");
      scooterStatus.value = await utils_status.getUserScooterStatus();
      isComplete.value = false;
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          latitude.value = res.latitude;
          longitude.value = res.longitude;
          if (markers.value.some((marker) => {
            return marker.id === 999999999;
          })) {
            markers.value.map((marker) => {
              if (marker.id === 999999999) {
                marker.latitude = latitude.value;
                marker.longitude = longitude.value;
                return marker;
              } else {
                return marker;
              }
            });
          } else {
            markers.value.push({
              id: 999999999,
              latitude: latitude.value,
              longitude: longitude.value,
              width: 32,
              height: 32,
              iconPath: "/static/diandongche.png"
            });
          }
          console.log(markers.value);
        },
        fail: (err) => {
          console.log(err);
        }
      });
      api_index.api.getAllStationInfo().then((res) => {
        stationList.value = res.data.stations.map((station) => ({
          ...station,
          distance: Math.min(
            ...station.location.map((location) => {
              return utils_location.getDistance(latitude.value, longitude.value, Number(location.latitude), Number(location.longitude));
            })
          )
        })).sort((station1, station2) => {
          return station1.distance - station2.distance;
        });
        polygons.value = res.data.stations.map((station) => ({
          points: station.location,
          strokeWidth: 2,
          strokeColor: "#000000",
          fillColor: "#E85562",
          zIndex: 1,
          level: "abovelabels"
        }));
        markers.value = res.data.stations.map((station) => ({
          id: station.stationId,
          latitude: arrange(
            station.location.map((location) => {
              return location.latitude;
            })
          ),
          longitude: arrange(
            station.location.map((location) => {
              return location.longitude;
            })
          ),
          iconPath: "",
          callout: {
            content: station.name,
            color: "#000",
            fontSize: 16,
            borderRadius: 12,
            display: "ALWAYS",
            padding: 4
          }
        })).concat(markers.value);
        isComplete.value = true;
      });
    });
    const onClickMarker = (event) => {
      const station = stationList.value.filter((station2) => {
        return station2.stationId === event.detail.markerId;
      })[0];
      common_vendor.index.navigateTo({
        url: `/pages/search/searchmain/index?id=${station.stationId}&name=${station.name}&distance=${utils_location.distanceFormatter(
          station.distance
        )}`
      });
    };
    const onClickStation = (station) => {
      if (!isActive.value) {
        common_vendor.index.showModal({
          title: "错误",
          content: "您还未激活\n，请添加电动车后找站管激活。",
          showCancel: false
        });
        return;
      } else if (isNeedUpdateProfile.value) {
        common_vendor.index.showModal({
          title: "错误",
          content: "您还未完善个人信息，是否前往完善？",
          showCancel: true,
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/components/userProfile/userProfile"
              });
            }
          }
        });
        return;
      } else if (scooterStatus.value !== utils_status.UserScooterStatus.Normal) {
        common_vendor.index.showModal({
          title: "错误",
          content: scooterStatus.value === utils_status.UserScooterStatus.None ? "您还没有绑定电动车，请绑定电动车。" : "您的电动车暂未激活，请先找站管进行激活。",
          showCancel: false
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/search/searchmain/index?id=${station.stationId}&name=${station.name}&distance=${utils_location.distanceFormatter(
          station.distance
        )}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isComplete.value
      }, isComplete.value ? {
        b: latitude.value,
        c: longitude.value,
        d: polygons.value,
        e: markers.value,
        f: common_vendor.o(onClickMarker)
      } : {}, {
        g: common_vendor.f(stationList.value, (station, index, i0) => {
          var _a, _b, _c;
          return {
            a: common_vendor.t(station.name),
            b: common_vendor.t((_a = station.stat) == null ? void 0 : _a.total),
            c: common_vendor.t((_b = station.stat) == null ? void 0 : _b.free),
            d: common_vendor.t((_c = station.stat) == null ? void 0 : _c.soon),
            e: common_vendor.t(station.locationDesc),
            f: common_vendor.t(common_vendor.unref(utils_location.distanceFormatter)(station.distance)),
            g: index,
            h: common_vendor.o(($event) => onClickStation(station), index)
          };
        }),
        h: common_vendor.p({
          ["has-more"]: false
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-308a4d57"]]);
wx.createPage(MiniProgramPage);
