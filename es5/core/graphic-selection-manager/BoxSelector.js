function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import BaseSelector from './BaseSelector';
import { loadModules } from 'esri-module-loader';
import { SELECTOR_TYPE } from './constants';

var BoxSelector =
/*#__PURE__*/
function (_BaseSelector) {
  _inherits(BoxSelector, _BaseSelector);

  function BoxSelector(args) {
    var _this;

    _classCallCheck(this, BoxSelector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BoxSelector).call(this, args));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_dragHandler", function (e) {
      e.stopPropagation();

      if (e.action === 'start') {
        _this._dragStartHandler(e);
      } else if (e.action === 'end') {
        _this._dragEndHandler(e);
      } else if (e.action === 'update') {
        _this._dragUpdateHandler(e);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_dragStartHandler", function (e) {
      e.stopPropagation();
      loadModules('esri/geometry/Polygon').then(function (Polygon) {
        var x = e.x,
            y = e.y;
        var _this$gsm = _this.gsm,
            view = _this$gsm.view,
            layers = _this$gsm.layers;
        _this._startPoint = view.toMap({
          x: x,
          y: y
        });
        _this._boxGraphic.geometry = new Polygon({
          rings: [],
          spatialReference: {
            wkid: layers[0].spatialReference.wkid
          }
        });

        _this._tempGraphicsLayer.add(_this._boxGraphic);
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_dragUpdateHandler", function (e) {
      if (_this._startPoint) {
        e.stopPropagation();
        loadModules(['esri/geometry/Polygon', 'esri/geometry/Extent']).then(function (_ref) {
          var Polygon = _ref.Polygon,
              Extent = _ref.Extent;
          var x = e.x,
              y = e.y;
          var _this$gsm2 = _this.gsm,
              view = _this$gsm2.view,
              layers = _this$gsm2.layers;
          var mapPoint = view.toMap({
            x: x,
            y: y
          });
          var ext = new Extent({
            xmin: Math.min(_this._startPoint.x, mapPoint.x),
            ymin: Math.min(_this._startPoint.y, mapPoint.y),
            xmax: Math.max(_this._startPoint.x, mapPoint.x),
            ymax: Math.max(_this._startPoint.y, mapPoint.y),
            spatialReference: {
              wkid: layers[0].spatialReference.wkid
            }
          });
          _this._boxGraphic.geometry = Polygon.fromExtent(ext);
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_dragEndHandler", function (e) {
      if (_this._boxGraphic) {
        e.stopPropagation();

        _this._computeIntersects(_this._boxGraphic.geometry, e);

        _this._tempGraphicsLayer.remove(_this._boxGraphic);

        _this._startPoint = null;
      }
    });

    _this.type = SELECTOR_TYPE.BOX;
    _this._tempGraphicsLayer = null;
    _this._startPoint = null;
    _this._boxGraphic = null;
    _this._handlers = [];
    _this._status = ''; // initiating, ready, destroying

    return _this;
  }

  _createClass(BoxSelector, [{
    key: "_init",
    value: function _init() {
      var _this2 = this;

      return loadModules(['esri/layers/GraphicsLayer', 'esri/geometry/Polygon', 'esri/geometry/Extent', // preload
      'esri/geometry/geometryEngine', // preload
      'esri/Graphic']).then(function (_ref2) {
        var GraphicsLayer = _ref2.GraphicsLayer,
            Polygon = _ref2.Polygon,
            Graphic = _ref2.Graphic;
        var _this2$gsm = _this2.gsm,
            view = _this2$gsm.view,
            layers = _this2$gsm.layers;
        var map = view.map;
        var graphicsLayer = new GraphicsLayer({
          id: '__box_selector_temp_graphics_layer__'
        });
        var boxGraphic = new Graphic({
          geometry: new Polygon({
            rings: [],
            spatialReference: {
              wkid: layers[0].spatialReference.wkid
            }
          }),
          symbol: {
            type: "simple-fill",
            color: [0, 0, 0, .1],
            style: "solid",
            outline: {
              color: [0, 0, 0, .9],
              width: 1
            }
          }
        });
        graphicsLayer.add(_this2._boxGraphic = boxGraphic);
        map.add(_this2._tempGraphicsLayer = graphicsLayer);
      });
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var view = this.gsm.view;
      this._handlers = [view.on('drag', this._dragHandler)];
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      this._handlers.forEach(function (h) {
        return h.remove();
      });
    }
  }, {
    key: "_computeIntersects",
    value: function _computeIntersects(boxGeometry, event) {
      var _this3 = this;

      loadModules('esri/geometry/geometryEngine').then(function (geometryEngine) {
        var _this3$gsm = _this3.gsm,
            layers = _this3$gsm.layers,
            selectionManager = _this3$gsm.selectionManager;
        var graphicsLayers = layers.filter(function (l) {
          return l.type === 'graphics';
        });
        var featureLayers = layers.filter(function (l) {
          return l.type === 'feature';
        });
        var selectedGraphics = [];
        graphicsLayers.forEach(function (graphicLayer) {
          graphicLayer.graphics.forEach(function (g) {
            if (geometryEngine.intersects(boxGeometry, g.geometry)) {
              selectedGraphics.push(g);
            }
          });
        });
        Promise.all(featureLayers.map(function (layer) {
          var query = layer.createQuery();
          query.outFields = layer.fields.map(function (f) {
            return f.name;
          }); // by default, outFields is not all the fields

          return layer.queryFeatures(query);
        })).then(function (results) {
          results.forEach(function (result) {
            result.features.forEach(function (g) {
              if (geometryEngine.intersects(boxGeometry, g.geometry)) {
                selectedGraphics.push(g);
              }
            });
          });
          selectionManager.select(selectedGraphics, {
            event: event
          });
        });
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var map = this.gsm.view.map;

      if (this._tempGraphicsLayer) {
        if (this._boxGraphic) {
          this._tempGraphicsLayer.remove(this._boxGraphic);

          this._boxGraphic = null;
        }

        map.remove(this._tempGraphicsLayer);
        this._tempGraphicsLayer = null;
      }
    }
  }, {
    key: "activate",
    value: function activate() {
      var _this4 = this;

      this._init().then(function (_) {
        _this4._bindEvents();
      });
    }
  }, {
    key: "deactivate",
    value: function deactivate() {
      this._unbindEvents();
    }
  }]);

  return BoxSelector;
}(BaseSelector);

export default BoxSelector;