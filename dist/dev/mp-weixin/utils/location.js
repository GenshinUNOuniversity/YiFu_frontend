"use strict";
const getDistance = (lat1, lng1, lat2, lng2) => {
  const PI = 3.1415926;
  const EarthRadius = 6378137;
  const Rad = PI / 180;
  const radlat1 = lat1 * Rad;
  const radlat2 = lat2 * Rad;
  const a = radlat1 - radlat2;
  const b = (lng1 - lng2) * Rad;
  let s = 2 * Math.asin(
    Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.pow(Math.sin(b / 2), 2))
  );
  s = s * EarthRadius;
  s = Math.round(s * 100) / 100;
  return s;
};
const distanceFormatter = (s) => {
  if (s < 1e3) {
    return `${s} m`;
  } else {
    return `${(s / 1e3).toFixed(2)} km`;
  }
};
exports.distanceFormatter = distanceFormatter;
exports.getDistance = getDistance;
