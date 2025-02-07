"use strict";
const common_vendor = require("../common/vendor.js");
const api_index = require("./index.js");
const utils_jwt = require("../utils/jwt.js");
const business_auth_useAuth = require("../business/auth/useAuth.js");
const { doLogin, authStorage } = business_auth_useAuth.useAuth();
const instance = new common_vendor.Request({
  baseURL: "https://test-api.ddc.ziqiang.nowcent.cn"
});
instance.interceptors.request.use(async (config) => {
  let auth = common_vendor.index.getStorageSync("auth");
  if (!auth || config.url === "/login/refresh" || config.url === "/login/wechat")
    return config;
  const { exp } = utils_jwt.weappJwtDecode(auth);
  if (Date.now() >= exp * 1e3) {
    const refresh = common_vendor.index.getStorageSync("refresh");
    if (!refresh) {
      throw new Error("Refresh is expired");
    }
    try {
      await api_index.api.refresh();
      auth = common_vendor.index.getStorageSync("auth");
    } catch (err) {
      throw err;
    }
  }
  if (auth) {
    config.header = {
      ...config.header,
      Authorization: auth
    };
  }
  return config;
});
instance.interceptors.response.use(
  (response) => {
    console.log("response Success", response.config.url, ":", response.data);
    return response.data;
  },
  async (error) => {
    console.log("response Error", error.config.url, ":", error.data);
    const showError = () => {
      var _a;
      if (!/^\/user\/\d+\/manager$/.test(error.config.url) && error.data.message !== "未找到该用户" && !/\/scooter\/audit\/user-info\?code=(.*)/.test(error.config.url)) {
        common_vendor.index.showToast({
          title: ((_a = error.data) == null ? void 0 : _a.message) ?? error.errMsg,
          icon: "error"
        });
      }
    };
    return new Promise(async (resolve, reject) => {
      const data = error.data;
      if (data) {
        const regex = /^401\d\d$/;
        const needLogin = regex.test(data.code);
        if (needLogin && error.config.url !== "/login/wechat") {
          try {
            await doLogin();
            error.config.header = error.config.header ?? {};
            error.config.header["Authorization"] = authStorage.auth;
            const res = await instance.request(error.config);
            resolve(res);
          } catch {
            showError();
            return reject(error);
          }
        } else {
          showError();
          return reject(error);
        }
      }
    });
  }
);
exports.instance = instance;
