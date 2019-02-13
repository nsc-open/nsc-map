import * as turf from '@turf/turf';
export const toMecator = ([lng, lat]) => {
  return turf.toMercator(turf.point([lng, lat])).geometry.coordinates;
};
export const toWgs84 = ([x, y]) => {
  return turf.toWgs84(turf.point([x, y])).geometry.coordinates;
};
export const isWgs84 = spatialReference => {
  return spatialReference.wkid === 4326;
};
export const isMecator = spatialReference => {
  return spatialReference.wkid === 102100;
};
/**
 * points of [x, y] in webmercator cooridnates
 */

export const angle = (...args) => {
  let p1, p2, p3;

  if (args.length === 1) {
    // angle([p1, p2, p3])
    p1 = args[0][0];
    p2 = args[0][1];
    p3 = args[0][2];
  } else if (args.length === 3) {
    // angle(p1, p2, p3)
    p1 = args[0];
    p2 = args[1];
    p3 = args[2];
  } else {
    throw new Error('angle() requires 1 or 3 arguments');
  }

  if (Array.isArray(p1)) {
    p1 = {
      x: p1[0],
      y: p1[1]
    };
    p2 = {
      x: p2[0],
      y: p2[1]
    };
    p3 = {
      x: p3[0],
      y: p3[1]
    };
  }

  const aa = (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
  const a = Math.sqrt(aa);
  const bb = (p3.x - p2.x) * (p3.x - p2.x) + (p3.y - p2.y) * (p3.y - p2.y);
  const b = Math.sqrt(bb);
  const cc = (p1.x - p3.x) * (p1.x - p3.x) + (p1.y - p3.y) * (p1.y - p3.y);
  return Math.acos((aa + bb - cc) / 2 / a / b) * 180 / Math.PI;
};
/**
 * get angles of input polyline
 * @param {Geometry} polyline
 * @return {Array} return array of angles for each path
 */

export const polylineAngles = polyline => {
  const {
    paths = []
  } = polyline;
  let convertionRequired = false;

  if (isWgs84(polyline.spatialReference)) {
    convertionRequired = true;
  }

  return paths.map(path => path.map(pathAngles, convertionRequired));
};
export const pathAngles = (path = [], convertionRequired = false) => {
  return path.map((point, index) => {
    if (index === 0 || index === path.length - 1) {
      return 0;
    }

    if (convertionRequired) {
      point = toMecator(point);
    }

    return angle(path[index - 1], path[index], path[index + 1]);
  });
};