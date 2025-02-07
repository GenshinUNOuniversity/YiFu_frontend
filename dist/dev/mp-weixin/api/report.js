"use strict";
const common_vendor = require("../common/vendor.js");
const api_instance = require("./instance.js");
var reportStatus = /* @__PURE__ */ ((reportStatus2) => {
  reportStatus2["None"] = "None";
  reportStatus2["Created"] = "Created";
  reportStatus2["Committed"] = "Committed";
  reportStatus2["Rejected"] = "Rejected";
  reportStatus2["Solved"] = "Solved";
  return reportStatus2;
})(reportStatus || {});
const getPersonalReportList = async ({ pageNum, pageSize }) => {
  return api_instance.instance.get("/report", {
    params: {
      pageNum,
      pageSize
    }
  });
};
const getStationReportList = async ({
  stationId,
  pageNum,
  pageSize
}) => {
  return api_instance.instance.get(`/report/station/${stationId}`, { params: { pageNum, pageSize } });
};
const createReport = async (data) => {
  return api_instance.instance.post("/report", data);
};
const commitReport = async (reportId) => {
  return api_instance.instance.post(`/report/${reportId}/commit`);
};
const addReportContent = async (reportContent, reportId) => {
  return api_instance.instance.put(`/report/${reportId}/content`, reportContent);
};
const addReportPhoto = async (reportId, imageName) => {
  api_instance.instance.post(`/report/${reportId}/image`, { imageName }).then((res) => {
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
          return Promise.resolve(result);
        } else {
          return Promise.reject(result);
        }
      },
      fail(error) {
        return Promise.reject(error);
      }
    });
  });
};
const deleteReportPhoto = async (reportId, imageName) => {
  return api_instance.instance.delete(`/report/${reportId}/image/${imageName}`);
};
const changeReportStatus = async (reportId, status, message) => {
  return api_instance.instance.post(`/report/${reportId}/reply`, { status, message });
};
const report = {
  getPersonalReportList,
  getStationReportList,
  createReport,
  commitReport,
  addReportContent,
  addReportPhoto,
  changeReportStatus,
  deleteReportPhoto
};
exports.report = report;
exports.reportStatus = reportStatus;
