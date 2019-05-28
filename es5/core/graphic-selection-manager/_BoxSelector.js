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
import { SELECTOR_TYPE } from '../constants';

var BoxSelector =
/*#__PURE__*/
function (_BaseSelector) {
  _inherits(BoxSelector, _BaseSelector);

  function BoxSelector(args) {
    var _this;

    _classCallCheck(this, BoxSelector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BoxSelector).call(this, args));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_mapMouseDownHandler", function (e) {
      if (!_this._ready) {
        return;
      }

      e.stopPropagation();
      var _this$_modules = _this._modules,
          Graphic = _this$_modules.Graphic,
          Polygon = _this$_modules.Polygon,
          SpatialReference = _this$_modules.SpatialReference;
      var mapPoint = e.mapPoint;
      var polygon = new Polygon(new SpatialReference({
        wkid: 102100
      }));
      _this._startPoint = mapPoint;
      _this._boxGraphic = new Graphic(polygon, _this._createLineSymbol());

      _this._tempGraphicsLayer.add(_this._boxGraphic);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_mapMouseMoveHandler", function (e) {
      if (_this._startPoint) {
        e.stopPropagation();
        var _this$_modules2 = _this._modules,
            Extent = _this$_modules2.Extent,
            Polygon = _this$_modules2.Polygon;
        var mapPoint = e.mapPoint;
        var ext = new Extent({
          xmin: Math.min(_this._startPoint.x, mapPoint.x),
          ymin: Math.min(_this._startPoint.y, mapPoint.y),
          xmax: Math.max(_this._startPoint.x, mapPoint.x),
          ymax: Math.max(_this._startPoint.y, mapPoint.y),
          spatialReference: {
            wkid: 102100
          }
        });

        _this._boxGraphic.setGeometry(Polygon.fromExtent(ext));

        _this._boxGraphic.draw();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_mapMouseUpHandler", function (e) {
      if (_this._boxGraphic) {
        e.stopPropagation();

        _this._computeIntersects(_this._boxGraphic.geometry);

        _this._tempGraphicsLayer.remove(_this._boxGraphic);

        _this._boxGraphic = null;
        _this._startPoint = null;
      }
    });

    _this.type = SELECTOR_TYPE.BOX;
    _this._tempGraphicsLayer = null;
    _this._startPoint = null;
    _this._boxGraphic = null;
    _this._ready = false;
    _this._modules = {};
    _this._handlers = [];

    _this._init();

    return _this;
  }

  _createClass(BoxSelector, [{
    key: "_init",
    value: function _init() {
      var _this2 = this;

      loadModules(['GraphicsLayer', 'Color', 'SimpleLineSymbol', 'Graphic', 'Polygon', 'Extent', 'SpatialReference', 'geometryEngine']).then(function (modules) {
        _this2._modules = modules;

        _this2._createTempGraphicsLayer();

        _this2._ready = true;
      });
    }
  }, {
    key: "_createTempGraphicsLayer",
    value: function _createTempGraphicsLayer() {
      var map = this.selectionManager.map;
      var GraphicsLayer = this._modules.GraphicsLayer;
      var graphicsLayer = new GraphicsLayer({
        id: '__box_selector_temp_graphics_layer__'
      });
      map.addLayer(this._tempGraphicsLayer = graphicsLayer);
    }
  }, {
    key: "_removeTempGraphicsLayer",
    value: function _removeTempGraphicsLayer() {
      var map = this.selectionManager.map;

      if (this._tempGraphicsLayer) {
        map.removeLayer(this._tempGraphicsLayer);
      }
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var map = this.selectionManager.map;
      this._handlers = [map.on('mouse-drag-start', this._mapMouseDownHandler), map.on('mouse-drag', this._mapMouseMoveHandler), map.on('mouse-drag-end', this._mapMouseUpHandler)];
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      this._handlers.forEach(function (h) {
        return h.remove();
      });
    }
  }, {
    key: "_createLineSymbol",
    value: function _createLineSymbol() {
      var _this$_modules3 = this._modules,
          SimpleLineSymbol = _this$_modules3.SimpleLineSymbol,
          Color = _this$_modules3.Color;
      return new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1);
    }
  }, {
    key: "_computeIntersects",
    value: function _computeIntersects(boxGeometry) {
      var selectionManager = this.selectionManager;
      var geometryEngine = this._modules.geometryEngine;
      var selectedGraphics = selectionManager.graphicsLayer.graphics.filter(function (g) {
        return geometryEngine.intersects(boxGeometry, g.geometry);
      });
      selectionManager.select(selectedGraphics);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._removeTempGraphicsLayer();
    }
  }, {
    key: "activate",
    value: function activate() {
      this._bindEvents();

      this.selectionManager.map.disableMapNavigation();
    }
  }, {
    key: "deactivate",
    value: function deactivate() {
      this._unbindEvents();

      this.selectionManager.map.enableMapNavigation();
    }
  }]);

  return BoxSelector;
}(BaseSelector);

export default BoxSelector;