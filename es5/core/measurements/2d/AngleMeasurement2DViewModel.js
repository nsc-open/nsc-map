function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import EventEmitter from 'eventemitter3';
import { loadModules } from 'esri-module-loader';
import { createNamespace } from '../../../core/InstanceManager';
import { pathAngles } from '../../../utils/geometry';
var uid = 0;
var ns = createNamespace('__AngleMeasurement2DViewModel');

var angleFormatter = function angleFormatter(value) {
  return value.toFixed(1) + '°';
};

var AngleMeasurement2DViewModel =
/*#__PURE__*/
function () {
  function AngleMeasurement2DViewModel(_ref) {
    var view = _ref.view;

    _classCallCheck(this, AngleMeasurement2DViewModel);

    this.view = view;
    this.measureLabel = '';
    this.unit = '';
    this.measurement = null;
    this.sketchViewModel = null;
    this.graphicsLayer = null;
    this.labelGraphics = [];
    this.eventHandlers = [];
    this.uid = uid++;

    this._init();
  }

  _createClass(AngleMeasurement2DViewModel, [{
    key: "_init",
    value: function _init() {
      var _this = this;

      loadModules(['esri/Graphic', 'esri/layers/GraphicsLayer', 'esri/widgets/Sketch/SketchViewModel']).then(function (_ref2) {
        var GraphicsLayer = _ref2.GraphicsLayer,
            SketchViewModel = _ref2.SketchViewModel;
        var graphicsLayer = new GraphicsLayer();
        var sketchViewModel = new SketchViewModel({
          view: _this.view,
          layer: graphicsLayer,
          updateOnGraphicClick: false,
          defaultUpdateOptions: {
            toggleToolOnClick: false
          }
        });

        _this.view.map.add(graphicsLayer);

        _this.graphicsLayer = graphicsLayer;
        _this.sketchViewModel = sketchViewModel;
        ns.set("".concat(_this.uid), sketchViewModel);
      });
      ns.register("".concat(this.uid));
    }
  }, {
    key: "_createTextSymbol",
    value: function _createTextSymbol(text) {
      return {
        type: "text",
        // autocasts as new TextSymbol()
        color: "white",
        haloColor: "black",
        haloSize: "1px",
        text: text,
        xoffset: 3,
        yoffset: 3,
        font: {
          // autocast as new Font()
          size: 12,
          family: "sans-serif",
          weight: "bold"
        }
      };
    }
  }, {
    key: "_drawStartPoint",
    value: function _drawStartPoint(graphic) {
      console.log('draw start point');
    }
  }, {
    key: "_drawEndPoint",
    value: function _drawEndPoint(graphic) {
      console.log('draw end point');
    }
  }, {
    key: "_drawLabel",
    value: function _drawLabel(graphic) {
      var _this2 = this;

      this.labelGraphics.forEach(function (g) {
        return _this2.graphicsLayer.remove(g);
      });
      var points = graphic.geometry.paths[0];
      var angles = pathAngles(points);
      console.log('points', points);
      console.log('pathAngles', pathAngles(points));
      EsriModuleLoader.loadModules(['esri/Graphic']).then(function (_ref3) {
        var Graphic = _ref3.Graphic;
        var labelGraphics = [];

        for (var i = 0; i < points.length; i++) {
          if (i === 0 || i === points.length - 1) {
            continue;
          }

          var _graphic = new Graphic({
            geometry: {
              type: 'point',
              x: points[i][0],
              y: points[i][1],
              spatialReference: {
                wkid: 102100
              }
            },
            symbol: _this2._createTextSymbol(angleFormatter(angles[i]))
          });

          _this2.graphicsLayer.add(_graphic);

          labelGraphics.push(_graphic);
        }

        _this2.labelGraphics = labelGraphics;
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.view.map.remove(this.graphicsLayer);
      this.sketchViewModel = null;
      this.graphicsLayer = null;
      this.anglePoints = [];
    }
  }, {
    key: "newMeasurement",
    value: function newMeasurement() {
      var _this3 = this;

      this.clearMeasurement();
      ns.get("".concat(this.uid)).then(function (sketchViewModel) {
        sketchViewModel.create('polyline', {
          mode: 'click'
        });

        _this3.eventHandlers.push(sketchViewModel.on('create', function (_ref4) {
          var graphic = _ref4.graphic,
              state = _ref4.state;

          switch (state) {
            case 'start':
              _this3._drawStartPoint(graphic);

              break;

            case 'active':
              _this3._drawLabel(graphic);

              break;

            case 'complete':
              _this3._drawEndPoint(graphic);

              break;
          }
        }));
      });
    }
  }, {
    key: "clearMeasurement",
    value: function clearMeasurement() {
      var _this4 = this;

      ns.get("".concat(this.uid)).then(function (sketchViewModel) {
        console.log('resset');
        sketchViewModel.reset();

        _this4.graphicsLayer.removeAll();

        _this4.eventHandlers.forEach(function (h) {
          return h.remove();
        });

        _this4.eventHandlers = [];
      });
    }
  }]);

  return AngleMeasurement2DViewModel;
}();

export default AngleMeasurement2DViewModel;