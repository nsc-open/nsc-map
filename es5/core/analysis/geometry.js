import * as geometryUtils from '../../utils/geometry';
import { toMecator } from '../../utils/conversions';
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

  if (geometryUtils.isWgs84(polyline.spatialReference)) {
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

    return geometryUtils.angle(path[index - 1], path[index], path[index + 1]);
  });
};