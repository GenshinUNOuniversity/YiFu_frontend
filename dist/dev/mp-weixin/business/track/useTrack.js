"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
var PageId = /* @__PURE__ */ ((PageId2) => {
  PageId2["My"] = "my";
  PageId2["Query"] = "query";
  PageId2["Charge"] = "charge";
  return PageId2;
})(PageId || {});
var EventId = /* @__PURE__ */ ((EventId2) => {
  EventId2["CLIK"] = "CLIK";
  EventId2["IMPL"] = "IMPL";
  return EventId2;
})(EventId || {});
let systemInfo;
const useTrack = () => {
  const init = async () => {
    return new Promise((resolve) => {
      common_vendor.index.getSystemInfo({
        success: (result) => {
          var _a;
          systemInfo = {
            brand: result.brand ?? "未知",
            model: result.model ?? "未知",
            platform: ((_a = result.platform) == null ? void 0 : _a.toLowerCase()) ?? "未知"
          };
          resolve(systemInfo);
        }
      });
    });
  };
  const doTrack = async ({
    pgid,
    eid = "",
    eventId,
    ext = {}
  }) => {
    if (!systemInfo) {
      await init();
    }
    const userId = +common_vendor.index.getStorageSync("userId");
    const res = await api_index.api.doTrack({
      brand: systemInfo.brand,
      elementId: eid,
      eventId,
      ext,
      model: systemInfo.model,
      pageId: pgid,
      platform: systemInfo.platform,
      trackTime: (/* @__PURE__ */ new Date()).valueOf(),
      userId: userId != 0 ? userId : void 0
    });
    console.log(res);
  };
  return {
    doTrack,
    PageId,
    EventId
  };
};
exports.useTrack = useTrack;
