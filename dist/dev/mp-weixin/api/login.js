"use strict";
const common_vendor = require("../common/vendor.js");
const api_instance = require("./instance.js");
const login = async () => {
  common_vendor.index.clearStorageSync();
  return new Promise((resolve, reject) => {
    common_vendor.index.login({
      success: (res) => {
        common_vendor.index.showLoading({ title: "登录中" });
        api_instance.instance.post("/login/wechat", { code: res.code }).then((res2) => {
          common_vendor.index.hideLoading();
          if (res2) {
            common_vendor.index.setStorageSync("auth", res2.data.token.auth);
            common_vendor.index.setStorageSync("refresh", res2.data.token.refresh);
            common_vendor.index.setStorageSync("userId", res2.data.userId);
            if (res2.data.needUpdateProfile) {
              common_vendor.index.navigateTo({ url: "/pages/components/userProfile/userProfile" });
            }
          }
          resolve(res2);
        }).catch((err) => {
          common_vendor.index.showToast({
            title: "登录失败",
            icon: "error"
          });
          reject();
        });
      },
      fail: () => {
        common_vendor.index.showToast({
          title: "登录失败",
          icon: "error"
        });
        reject();
      }
    });
  });
};
const refresh = async () => {
  const refresh2 = common_vendor.index.getStorageSync("refresh");
  api_instance.instance.post("/login/refresh", { refresh: refresh2 }).then((res) => {
    if (res) {
      common_vendor.index.setStorage({
        key: "auth",
        data: res.data.auth
      });
      common_vendor.index.setStorage({
        key: "refresh",
        data: res.data.refresh
      });
    }
  });
};
const login$1 = { login, refresh };
exports.login = login$1;
