"use strict";
const common_vendor = require("../common/vendor.js");
const api_instance = require("./instance.js");
const getUserScooterList = async ({ pageNum, pageSize }) => {
  return api_instance.instance.get("/scooter/scooter", {
    params: {
      pageNum,
      pageSize
    }
  });
};
const bondScooter = async (data, code, stationId) => {
  return api_instance.instance.post(`/scooter?code=${code}&stationId=${stationId}`, data);
};
const chargeScooter = async (scooterId, stationId, pileId, data) => {
  return api_instance.instance.post(`/scooter/${scooterId}/charge`, data, {
    params: {
      stationId,
      pileId
    }
  });
};
const addChargePhoto = (imageName) => {
  return new Promise((resolve, reject) => {
    api_instance.instance.get(`/scooter/charge/upload-pic-url?fileName=${imageName}`).then((res) => {
      common_vendor.index.uploadFile({
        url: res.data.url,
        filePath: imageName,
        name: "file",
        formData: {
          OSSAccessKeyId: res.data.accessId,
          policy: res.data.policy,
          success_action_status: "200",
          signature: res.data.signature,
          key: res.data.path
        },
        success(result) {
          if (result.statusCode === 200) {
            console.log(123);
            return resolve(res.data);
          } else {
            return reject("err");
          }
        },
        fail() {
          return reject("err");
        }
      });
    });
  });
};
const takeScooter = async ({ scooterId }) => {
  return api_instance.instance.delete(`/scooter/${scooterId}/charge`);
};
const endChargeScooter = async ({ scooterId }) => {
  return api_instance.instance.post(`/scooter/${scooterId}/charge/end`);
};
const disBondScooter = async ({ scooterId }) => {
  return api_instance.instance.delete(`/scooter/${scooterId}`);
};
const getAllScooter = async (pageNum, pageSize) => {
  return api_instance.instance.get("/scooter/scooter", {
    params: {
      pageNum,
      pageSize
    }
  });
};
const auditScooter = async (code, agree) => {
  return api_instance.instance.post(`/scooter/audit?code=${code}`, { agree });
};
const managerGetUserInfoByScooterCode = async (code) => {
  return api_instance.instance.get(`/scooter/audit/user-info?code=${code}`);
};
const managerGetUserHistoryScooter = async ({
  userId,
  pageNum = 1,
  pageSize = 1e3
}) => {
  return api_instance.instance.get(
    `/scooter/bind-history?userId=${userId}?pageNum=${pageNum}&pageSize=${pageSize}`
  );
};
const managerGetAuditScooterList = async ({ pageNum = 1, pageSize = 1e3 }) => {
  return api_instance.instance.get(`/scooter/audit/scooter-page?pageNum=${pageNum}&pageSize=${pageSize}`);
};
const scooter = {
  getUserScooterList,
  bondScooter,
  chargeScooter,
  takeScooter,
  endChargeScooter,
  disBondScooter,
  getAllScooter,
  auditScooter,
  addChargePhoto,
  managerGetUserInfoByScooterCode,
  managerGetUserHistoryScooter,
  managerGetAuditScooterList
};
exports.scooter = scooter;
