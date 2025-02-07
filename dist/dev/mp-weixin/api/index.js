"use strict";
const api_scooter = require("./scooter.js");
const api_login = require("./login.js");
const api_user = require("./user.js");
const api_report = require("./report.js");
const api_chargehistory = require("./chargehistory.js");
const api_track = require("./track.js");
const api_news = require("./news.js");
const api_station = require("./station.js");
const api_banner = require("./banner.js");
const api_blacklist = require("./blacklist.js");
const api = {
  ...api_login.login,
  ...api_scooter.scooter,
  ...api_user.user,
  ...api_report.report,
  ...api_chargehistory.chargehistory,
  ...api_track.track,
  ...api_news.news,
  ...api_station.station,
  ...api_banner.banner,
  ...api_blacklist.blacklist
};
exports.api = api;
