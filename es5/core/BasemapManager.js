function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { loadModules } from 'esri-module-loader';

var removeBasemap = function removeBasemap(map) {
  if (map.basemap) {
    map.basemap.cancelLoad();
    map.basemap.baseLayers.forEach(function (layer) {
      return map.remove(layer);
    });
  }
}; // sample basemaps:
// const BASEMAPS = [{
//   id: 'statellite',
//   label: '卫星影像',
//   mapLayer: {
//     urlTemplate: 'http://mt{subDomain}.google.cn/vt/lyrs=s&x={col}&y={row}&z={level}&s=Gali',
//     subDomains: '0123'.split('')
//   },
//   annotationLayer: {
//     urlTemplate: `http://t{subDomain}.tianditu.com/DataServer?tk=${TIANDITU_TOKEN}&T=cia_w&x={col}&y={row}&l={level}`,
//     subDomains: '01234567'.split('')
//   }
// }]


var BasemapManager = /*#__PURE__*/function () {
  function BasemapManager(_ref) {
    var map = _ref.map,
        _ref$basemaps = _ref.basemaps,
        basemaps = _ref$basemaps === void 0 ? [] : _ref$basemaps;

    _classCallCheck(this, BasemapManager);

    this.map = map;
    this.annotationLayer = null;
    this.basemaps = basemaps;
    this.annotationVisible = false;
  }

  _createClass(BasemapManager, [{
    key: "_removeBasemap",
    value: function _removeBasemap() {
      removeBasemap(this.map);
    }
  }, {
    key: "_setBasemap",
    value: function _setBasemap(basemap) {
      var _this = this;

      this._removeBasemap();

      loadModules(['esri/Basemap', 'esri/layers/WebTileLayer']).then(function (_ref2) {
        var Basemap = _ref2.Basemap,
            WebTileLayer = _ref2.WebTileLayer;
        var mapLayer = new WebTileLayer(basemap.mapLayer);
        var annotationLayer = new WebTileLayer(_objectSpread(_objectSpread({}, basemap.annotationLayer), {}, {
          visible: _this.annotationVisible
        }));
        _this.annotationLayer = annotationLayer;
        _this.map.basemap = new Basemap({
          baseLayers: [mapLayer, annotationLayer]
        });
      });
    }
  }, {
    key: "showMap",
    value: function showMap() {
      var basemap = this.basemaps.find(function (b) {
        return b.id === 'map';
      });

      this._setBasemap(basemap);
    }
  }, {
    key: "showSatellite",
    value: function showSatellite() {
      var basemap = this.basemaps.find(function (b) {
        return b.id === 'statellite';
      });

      this._setBasemap(basemap);
    }
  }, {
    key: "showAnnotation",
    value: function showAnnotation() {
      this.annotationVisible = true;

      if (this.annotationLayer) {
        this.annotationLayer.visible = true;
      }
    }
  }, {
    key: "hideAnnotation",
    value: function hideAnnotation() {
      this.annotationVisible = false;

      if (this.annotationLayer) {
        this.annotationLayer.visible = false;
      }
    }
  }]);

  return BasemapManager;
}();

BasemapManager.removeBasemap = removeBasemap;
export default BasemapManager;