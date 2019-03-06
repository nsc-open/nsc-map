function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import * as turf from '@turf/turf';
/**
 * graphic.geometry has type
 * but graphic.toJSON().geometry has no type
 */

export var type = function type(geometry) {
  if (geometry.type) {
    return geometry.type;
  } else if (geometry.paths) {
    return 'polyline';
  } else if (geometry.rings) {
    return 'polygon';
  } else if (geometry.points) {
    return 'multipoint';
  } else if ('x' in geometry) {
    return 'point';
  }
};
export var toMecator = function toMecator(_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      lng = _ref2[0],
      lat = _ref2[1];

  return turf.toMercator(turf.point([lng, lat])).geometry.coordinates;
};
export var toWgs84 = function toWgs84(_ref3) {
  var _ref4 = _slicedToArray(_ref3, 2),
      x = _ref4[0],
      y = _ref4[1];

  return turf.toWgs84(turf.point([x, y])).geometry.coordinates;
};
export var isWgs84 = function isWgs84(spatialReference) {
  return spatialReference.wkid === 4326;
};
export var isMecator = function isMecator(spatialReference) {
  return spatialReference.wkid === 102100;
};
/**
 * points of [x, y] in webmercator cooridnates
 */

export var angle = function angle() {
  var p1, p2, p3;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

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

  var aa = (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
  var a = Math.sqrt(aa);
  var bb = (p3.x - p2.x) * (p3.x - p2.x) + (p3.y - p2.y) * (p3.y - p2.y);
  var b = Math.sqrt(bb);
  var cc = (p1.x - p3.x) * (p1.x - p3.x) + (p1.y - p3.y) * (p1.y - p3.y);
  return Math.acos((aa + bb - cc) / 2 / a / b) * 180 / Math.PI;
};
/**
 * get angles of input polyline
 * @param {Geometry} polyline
 * @return {Array} return array of angles for each path
 */

export var polylineAngles = function polylineAngles(polyline) {
  var _polyline$paths = polyline.paths,
      paths = _polyline$paths === void 0 ? [] : _polyline$paths;
  var convertionRequired = false;

  if (isWgs84(polyline.spatialReference)) {
    convertionRequired = true;
  }

  return paths.map(function (path) {
    return path.map(pathAngles, convertionRequired);
  });
};
export var pathAngles = function pathAngles() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var convertionRequired = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return path.map(function (point, index) {
    if (index === 0 || index === path.length - 1) {
      return 0;
    }

    if (convertionRequired) {
      point = toMecator(point);
    }

    return angle(path[index - 1], path[index], path[index + 1]);
  });
};