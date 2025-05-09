// eslint-disable-next-line max-params
export const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const PI = 3.1415926;
  const EarthRadius = 6378137;
  const Rad = PI / 180.0;
  const radlat1 = lat1 * Rad;
  const radlat2 = lat2 * Rad;
  const a = radlat1 - radlat2;
  const b = (lng1 - lng2) * Rad;
  let s =
    2 *
    Math.asin(
      Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.pow(Math.sin(b / 2), 2)),
    );
  s = s * EarthRadius;
  s = Math.round(s * 100) / 100;
  return s;
};

export const distanceFormatter = (s: number) => {
  if (s < 1000) {
    return `${s} m`;
  } else {
    return `${(s / 1000).toFixed(2)} km`;
  }
};
