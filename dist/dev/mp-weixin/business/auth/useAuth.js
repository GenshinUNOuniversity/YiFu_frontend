"use strict";
const common_vendor = require("../../common/vendor.js");
const api_instance = require("../../api/instance.js");
let callbackList = Array();
let loading = false;
const useAuth = () => {
  const authStorage = {
    set auth(value) {
      common_vendor.index.setStorage({
        key: "auth",
        data: value
      });
    },
    set refresh(value) {
      common_vendor.index.setStorage({
        key: "refresh",
        data: value
      });
    },
    set userId(value) {
      common_vendor.index.setStorage({
        key: "userId",
        data: value
      });
    },
    set needUpdateProfile(value) {
      common_vendor.index.setStorage({
        key: "needUpdateProfile",
        data: value
      });
    },
    get auth() {
      return common_vendor.index.getStorageSync("auth");
    },
    get refresh() {
      return common_vendor.index.getStorageSync("refresh");
    },
    get userId() {
      return common_vendor.index.getStorageSync("userId");
    },
    get needUpdateProfile() {
      return common_vendor.index.getStorageSync("needUpdateProfile");
    }
  };
  const doLogin = async () => {
    return new Promise(async (resolve, reject) => {
      callbackList.push([resolve, reject]);
      await login();
    });
  };
  const login = async () => {
    const loginFinally = () => {
      callbackList = [];
      loading = false;
    };
    const resolveAll = () => {
      callbackList.forEach(([resolve]) => {
        resolve();
      });
      loginFinally();
    };
    const rejectAll = () => {
      callbackList.forEach(([, reject]) => {
        reject();
      });
      loginFinally();
    };
    if (loading) {
      return;
    }
    loading = true;
    common_vendor.index.clearStorageSync();
    let codeRes;
    common_vendor.index.showLoading({ title: "登录中" });
    try {
      codeRes = await new Promise((resolve, reject) => {
        common_vendor.index.login({
          success: (result) => {
            resolve(result);
          },
          fail: (result) => {
            reject(result);
          }
        });
      });
    } catch (e) {
      console.error(e);
      common_vendor.index.showToast({
        title: "登录失败",
        icon: "error"
      });
      rejectAll();
      return;
    } finally {
      common_vendor.index.hideLoading();
    }
    let loginRes;
    common_vendor.index.showLoading({ title: "登录中" });
    try {
      loginRes = await api_instance.instance.post("/login/wechat", { code: codeRes.code });
    } catch (e) {
      console.error(e);
      common_vendor.index.showToast({
        title: "登录失败",
        icon: "error"
      });
      rejectAll();
      return;
    } finally {
      common_vendor.index.hideLoading();
    }
    authStorage.auth = loginRes.data.token.auth;
    authStorage.refresh = loginRes.data.token.refresh;
    authStorage.userId = loginRes.data.userId;
    authStorage.needUpdateProfile = loginRes.data.needUpdateProfile;
    if (loginRes.data.needUpdateProfile) {
      const pages = getCurrentPages();
      console.log();
      if (pages[pages.length - 1].route !== "pages/components/userProfile/userProfile") {
        common_vendor.index.redirectTo({ url: "/pages/components/userProfile/userProfile" });
      }
    }
    resolveAll();
  };
  return {
    doLogin,
    authStorage
  };
};
exports.useAuth = useAuth;
