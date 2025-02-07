"use strict";
const api_instance = require("./instance.js");
const getBanner = async () => {
  return api_instance.instance.get("/banner");
};
const banner = { getBanner };
exports.banner = banner;
