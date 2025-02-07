"use strict";
const common_vendor = require("../common/vendor.js");
const api_instance = require("./instance.js");
var UserType = /* @__PURE__ */ ((UserType2) => {
  UserType2["None"] = "NONE";
  UserType2["Staff"] = "STAFF";
  UserType2["Student"] = "STUDENT";
  return UserType2;
})(UserType || {});
var Role = /* @__PURE__ */ ((Role2) => {
  Role2["Admin"] = "Admin";
  Role2["Banned"] = "Banned";
  Role2["Manager"] = "Manager";
  Role2["None"] = "None";
  Role2["User"] = "User";
  return Role2;
})(Role || {});
const getUserInfo = async () => {
  const result = await api_instance.instance.get("/user/profile");
  common_vendor.index.setStorageSync("status", result.data.role);
  return result;
};
const managerGetUserInfo = async (userId) => {
  return api_instance.instance.get(`/user/${userId}/profile`);
};
const changeUserInfo = async (data, userType) => {
  return api_instance.instance.put(`/user/profile?type=${userType === "STUDENT" ? "student" : "stuff"}`, data);
};
const getManager = () => {
  return api_instance.instance.get("/user/manager");
};
const getWXPusherQrCode = async () => {
  return api_instance.instance.get("/user/wx-pusher/qr-code");
};
const giveUserAccess = async (userId, type = "None") => {
  return api_instance.instance.put(`/user/${userId}/role`, { userRole: type });
};
const getUserStatus = async () => {
  return api_instance.instance.get("/user/status");
};
const changeUserPhone = async (code, type, phone) => {
  return api_instance.instance.put(`/user/phone?type=${type}`, { code, phone });
};
const getUserPhoneCode = async (phone) => {
  return api_instance.instance.get(`/user/phone/code?phone=${phone}`);
};
const getFacultyList = async () => {
  return api_instance.instance.get("/user/faculty/list");
};
const deleteAccount = async () => {
  return api_instance.instance.delete("/user");
};
const user = {
  getUserInfo,
  changeUserInfo,
  getManager,
  getWXPusherQrCode,
  giveUserAccess,
  getUserStatus,
  changeUserPhone,
  getUserPhoneCode,
  managerGetUserInfo,
  getFacultyList,
  deleteAccount
};
exports.Role = Role;
exports.UserType = UserType;
exports.user = user;
