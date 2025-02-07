"use strict";
const api_instance = require("./instance.js");
var Status = /* @__PURE__ */ ((Status2) => {
  Status2["EndedByOther"] = "EndedByOther";
  Status2["EndedBySelf"] = "EndedBySelf";
  Status2["EndedPeacefully"] = "EndedPeacefully";
  Status2["ForcedEnd"] = "ForcedEnd";
  Status2["None"] = "None";
  Status2["Using"] = "Using";
  return Status2;
})(Status || {});
const getChargeHistory = async (params) => {
  return api_instance.instance.get("/charge-history", {
    params
  });
};
const getInProgressHistory = async () => {
  return api_instance.instance.get("/charge-history/in-progress");
};
const chargehistory = { getInProgressHistory, getChargeHistory };
exports.Status = Status;
exports.chargehistory = chargehistory;
