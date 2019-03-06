function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import queryString from 'query-string';
import { loadModules } from 'esri-module-loader';
var LAYER_TYPE = {
  TILE: 'tiled',
  DYNAMIC: 'dynamic'
};
var registeredTokens = [];
export var isPBS = function isPBS() {
  var layerServiceUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return layerServiceUrl.includes('/PBS/');
};
export var parseToken = function parseToken() {
  var layerServiceUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var _queryString$parseUrl = queryString.parseUrl(layerServiceUrl),
      url = _queryString$parseUrl.url,
      query = _queryString$parseUrl.query;

  return {
    url: url,
    token: query.token
  };
};
/**
 * for secured layer service, token needs to be included in the url
 * note: basically arcgis layer service is able to access by ajax without any cross origin issue
 */

export var fetchArcgisLayerServiceJson = function fetchArcgisLayerServiceJson() {
  var layerServiceUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var _queryString$parseUrl2 = queryString.parseUrl(layerServiceUrl),
      url = _queryString$parseUrl2.url,
      query = _queryString$parseUrl2.query;

  query.f = 'json';
  return fetch("".concat(url, "?").concat(queryString.stringify(query))).then(function (r) {
    return r.json();
  });
};
/**
 * get layer service type, tiled or dynamic
 * if PBS, it is tile layer
 * if arcgis layer service, need to fetch with url?f=json to tell
 * 
 * securied layer service needs token included in layerServiceUrl
 */

export var inferLayerServiceType = function inferLayerServiceType() {
  var layerServiceUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (isPBS(layerServiceUrl)) {
    return Promise.resolve(LAYER_TYPE.TILE);
  } else {
    return fetchArcgisLayerServiceJson(layerServiceUrl).then(function (json) {
      return json.tileInfo ? LAYER_TYPE.TILE : LAYER_TYPE.DYNAMIC;
    });
  }
};
export var createLayerServiceInstance = function createLayerServiceInstance(_ref) {
  var id = _ref.id,
      _ref$url = _ref.url,
      url = _ref$url === void 0 ? '' : _ref$url,
      type = _ref.type;
  return Promise.all([type ? Promise.resolve(type) : inferLayerServiceType(url), loadModules(['esri/layers/WebTileLayer', 'esri/layers/MapImageLayer', 'esri/identity/IdentityManager'])]).then(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        layerServiceType = _ref3[0],
        _ref3$ = _ref3[1],
        WebTileLayer = _ref3$.WebTileLayer,
        MapImageLayer = _ref3$.MapImageLayer,
        IdentityManager = _ref3$.IdentityManager;

    if (isPBS(url)) {
      return new WebTileLayer({
        id: id,
        urlTemplate: url + '/tile/{level}/{row}/{col}'
      });
    } else {
      var _parseToken = parseToken(url),
          server = _parseToken.url,
          token = _parseToken.token;

      if (token && !registeredTokens.includes(token)) {
        IdentityManager.registerToken({
          server: server,
          token: token
        });
        registeredTokens.push(token);
      }

      return layerServiceType === LAYER_TYPE.TILE ? new WebTileLayer({
        id: id,
        url: url
      }) : new MapImageLayer({
        id: id,
        url: url
      });
    }
  });
};