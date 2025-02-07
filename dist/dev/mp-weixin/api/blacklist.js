"use strict";
const common_vendor = require("../common/vendor.js");
const api_instance = require("./instance.js");
const sendToBlackList = async (reason, due, userId, scooterId, scooterCode) => {
  if (userId === void 0 && scooterId === void 0 && scooterCode === void 0) {
    common_vendor.index.showToast({
      title: "用户和电动车不能同时为空"
    });
  }
  return api_instance.instance.post(
    `/user/black-list?reason=${reason}&due=${due}${scooterId ? "&scooterId=" + scooterId : ""}${scooterCode ? "&scooterCode=" + scooterCode : ""}${userId ? "&userId=" + userId : ""}`
  );
};
const getBlackList = async (pageNum, pageSize) => {
  return api_instance.instance.get(`/user/black-list`, { params: { pageNum, pageSize } });
};
const deleteBlackList = async (blackListHistoryId) => {
  return api_instance.instance.delete(`/user/black-list/${blackListHistoryId}`);
};
const blacklist = { sendToBlackList, getBlackList, deleteBlackList };
exports.blacklist = blacklist;
