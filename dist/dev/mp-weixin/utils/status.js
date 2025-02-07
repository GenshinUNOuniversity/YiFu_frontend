"use strict";
const common_vendor = require("../common/vendor.js");
const api_index = require("../api/index.js");
var UserScooterStatus = /* @__PURE__ */ ((UserScooterStatus2) => {
  UserScooterStatus2["Normal"] = "NORMAL";
  UserScooterStatus2["None"] = "NONE";
  UserScooterStatus2["Auditing"] = "AUDITING";
  return UserScooterStatus2;
})(UserScooterStatus || {});
const getUserScooterStatus = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        data: { data: scooterList }
      } = await api_index.api.getUserScooterList({
        pageNum: 1,
        pageSize: 500
      });
      const normalAndAuditingScooterList = scooterList.filter((scooter) => {
        return scooter.status === "Normal" || scooter.status === "Auditing";
      });
      if (normalAndAuditingScooterList.length === 0) {
        common_vendor.index.setStorageSync(
          "ScooterStatus",
          "NONE"
          /* None */
        );
        resolve(
          "NONE"
          /* None */
        );
      }
      const auditingScooterList = normalAndAuditingScooterList.filter((scooter) => {
        return scooter.status === "Auditing";
      });
      if (auditingScooterList.length !== 0) {
        common_vendor.index.setStorageSync(
          "ScooterStatus",
          "AUDITING"
          /* Auditing */
        );
        resolve(
          "AUDITING"
          /* Auditing */
        );
      }
      common_vendor.index.setStorageSync(
        "ScooterStatus",
        "NORMAL"
        /* Normal */
      );
      resolve(
        "NORMAL"
        /* Normal */
      );
    } catch (error) {
      reject(error);
    }
  });
};
exports.UserScooterStatus = UserScooterStatus;
exports.getUserScooterStatus = getUserScooterStatus;
