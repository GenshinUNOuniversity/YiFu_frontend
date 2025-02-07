"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_location = require("../../utils/location.js");
const useCharge = () => {
  const inProgressHistory = common_vendor.ref();
  const updateInProgressHistory = () => {
    api_index.api.getInProgressHistory().then((data) => {
      if (data.data.length === 0 || data.data[0].status !== "Using") {
        inProgressHistory.value = void 0;
        return;
      }
      inProgressHistory.value = {
        ...data.data[0],
        begin: new Date(data.data[0].begin),
        end: data.data[0].end ? new Date(data.data[0].end) : void 0
      };
      console.log("🚀 ~ file: useCharge.ts:88 ~ awaitapi.getInProgressHistory ~ inProgressHistory:", inProgressHistory);
    });
  };
  const stationList = common_vendor.ref([]);
  const getStationList = async () => {
    api_index.api.getAllStationInfo().then((res) => {
      stationList.value = res.data.stations;
      findNearestStation();
      return Promise.resolve();
    }).catch((err) => {
      return Promise.reject(err);
    });
  };
  const nearestStationInfo = common_vendor.ref();
  const distanceToNearestStation = common_vendor.ref("");
  const userLongitude = common_vendor.ref(0);
  const userLatitude = common_vendor.ref(0);
  const findNearestStation = async () => {
    const oneStationMinDis = common_vendor.ref(Infinity);
    const oneStationLocationLat = common_vendor.ref(0);
    const oneStationLocationLng = common_vendor.ref(0);
    const minDis = common_vendor.ref(Infinity);
    const minStationLocationLat = common_vendor.ref(0);
    const minStationLocationLng = common_vendor.ref(0);
    common_vendor.index.getLocation({
      type: "gcj02",
      success: (res) => {
        userLongitude.value = res.longitude;
        userLatitude.value = res.latitude;
        stationList.value.forEach((station) => {
          oneStationMinDis.value = Infinity;
          station.location.forEach((location) => {
            const distance = (userLongitude.value - location.longitude) * (userLongitude.value - location.longitude) + (userLatitude.value - location.latitude) * (userLatitude.value - location.latitude);
            if (distance < oneStationMinDis.value) {
              oneStationMinDis.value = distance;
              oneStationLocationLat.value = location.latitude;
              oneStationLocationLng.value = location.longitude;
            }
          });
          if (minDis.value > oneStationMinDis.value) {
            minDis.value = oneStationMinDis.value;
            nearestStationInfo.value = station;
            minStationLocationLat.value = oneStationLocationLat.value;
            minStationLocationLng.value = oneStationLocationLng.value;
          }
        });
        distanceToNearestStation.value = utils_location.distanceFormatter(
          utils_location.getDistance(
            userLatitude.value,
            userLongitude.value,
            minStationLocationLat.value,
            minStationLocationLng.value
          )
        );
        console.log(distanceToNearestStation.value);
        common_vendor.index.hideLoading();
      },
      fail: (err) => {
        console.log(err);
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "获取定位失败",
          content: err.errMsg
        });
      }
    });
  };
  return {
    inProgressHistory,
    updateInProgressHistory,
    // getNews,
    // newsList,
    // getBanner,
    // bannerList,
    getStationList,
    stationList,
    findNearestStation,
    nearestStationInfo,
    getDistance: utils_location.getDistance,
    distanceToNearestStation
    // newsListPageNum,
    // newsListPageSize,
    // newsListHasMore,
  };
};
exports.useCharge = useCharge;
