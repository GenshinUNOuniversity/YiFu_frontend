"use strict";
const api_instance = require("./instance.js");
const getAllStationInfo = async () => {
  return api_instance.instance.get("/station");
};
var Status = /* @__PURE__ */ ((Status2) => {
  Status2["Ended"] = "Ended";
  Status2["Free"] = "Free";
  Status2["Repairing"] = "Repairing";
  Status2["Using"] = "Using";
  return Status2;
})(Status || {});
const getStationInfo = async ({ stationId }) => {
  return api_instance.instance.get(`/station/${stationId}`);
};
const getPileInfo = async ({ stationId, pileId }) => {
  return api_instance.instance.get(`/station/${stationId}/pile/${pileId}`);
};
const changeStationBoard = async (stationId, board) => {
  return api_instance.instance.post(`/station/${stationId}/board`, { board });
};
const station = { getAllStationInfo, getStationInfo, getPileInfo, changeStationBoard };
exports.Status = Status;
exports.station = station;
