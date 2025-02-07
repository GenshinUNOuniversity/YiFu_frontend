"use strict";
const common_vendor = require("../common/vendor.js");
const dateTimeFormatter = (time) => {
  return common_vendor.format(time, "yyyy-MM-dd HH:mm:ss");
};
const dateFormatter = (time) => {
  return common_vendor.format(time, "yyyy-MM-dd");
};
const timeFormatter = (time) => {
  return common_vendor.format(time, "dd日 HH:mm:ss");
};
exports.dateFormatter = dateFormatter;
exports.dateTimeFormatter = dateTimeFormatter;
exports.timeFormatter = timeFormatter;
