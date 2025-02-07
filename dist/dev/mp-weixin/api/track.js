"use strict";
const api_instance = require("./instance.js");
const doTrack = (dto) => {
  return api_instance.instance.post("/tracking", dto);
};
const track = {
  doTrack
};
exports.track = track;
