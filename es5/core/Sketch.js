function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import EventEmitter from 'eventemitter3';
import { loadModules } from 'esri-module-loader';

var addGraphic = function addGraphic(layer, graphic) {
  if (layer.type === 'graphics') {
    layer.add(graphic);
  } else if (layer.type === 'feature') {
    layer.applyEdits({
      addFeatures: [graphic]
    });
  } else {
    throw new Error('not supported layer', layer);
  }
};

var removeGraphic = function removeGraphic(layer, graphic) {
  if (layer.type === 'graphics') {
    layer.remove(graphic);
  } else if (layer.type === 'feature') {
    layer.applyEdits({
      deleteFeatures: [graphic]
    });
  } else {
    throw new Error('not supported layer', layer);
  }
};
/**
 * This sketch handles GraphicsLayer and FeatureLayer
 * 
 * usage:
 * 
 * const sketch = new Sketch({ view }, {
 *  beforeComplete: graphic => {
 *    // set graphic attributes 
 *    // update geometryJson
 *    // return Promise.resolve(graphic) // then apply the complete to the layer
 *  }
 * })
 * 
 * sketch.create(sourceGraphicsLayer, 'polyline')
 * sketch.create(sourceFeatureLayer)  // tool can be omitted here, it will be inferred from featureLayer
 * sketch.update(graphic)
 * sketch.update(sourceLayer, graphic)
 * 
 * sketch.destroy()
 */


var Sketch = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Sketch, _EventEmitter);

  var _super = _createSuper(Sketch);

  function Sketch(_ref, options) {
    var _this;

    var view = _ref.view,
        sketchViewModelProperties = _objectWithoutProperties(_ref, ["view"]);

    _classCallCheck(this, Sketch);

    _this = _super.call(this);

    if (!view) {
      throw new Error('view is required');
    }

    _this.options = _objectSpread({
      beforeComplete: null,
      removeOriginalFeatureBeforeUpdate: true
    }, options || {});
    _this.view = view;
    _this.sketchViewModelProperties = sketchViewModelProperties;
    _this.sketchViewModel = null;
    _this.sourceLayer = null; // source layer for create and update, it can be graphicsLayer or featureLayer

    _this.sourceGraphic = null;
    _this.editingGraphic = null;
    _this.state = 'ready'; // ready|create|update|complete|cancel

    _this._eventHandlers = [];
    _this.destroyed = false;
    return _this;
  } // always create a temp graphics layer for sketch, for both create or update. So this would have a unified
  // way to handle FeatureLayer and GraphicsLayer
  // for create, graphic needs to be remove from this temp graphicsLayer and add into the target layer
  // for update, graphics need to be edited should be hidden first, and clone into this temp graphicsLayer and do the update
  // once update complete, need to apply the updated graphics back to the source layer


  _createClass(Sketch, [{
    key: "_createSketchViewModel",
    value: function _createSketchViewModel() {
      var _this2 = this;

      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._resetSketchViewModel();

      return loadModules(['esri/widgets/Sketch/SketchViewModel', 'esri/layers/GraphicsLayer']).then(function (_ref2) {
        var SketchViewModel = _ref2.SketchViewModel,
            GraphicsLayer = _ref2.GraphicsLayer;

        if (_this2.destroyed) {
          return;
        }

        var view = _this2.view;
        var tempGraphicsLayer = new GraphicsLayer();
        view.map.add(tempGraphicsLayer);
        return new SketchViewModel(_objectSpread(_objectSpread(_objectSpread({}, _this2.sketchViewModelProperties), props), {}, {
          view: view,
          layer: tempGraphicsLayer,
          updateOnGraphicClick: false,
          defaultUpdateOptions: {
            tool: 'reshape'
          }
        }));
      });
    }
  }, {
    key: "_applyComplete",
    value: function _applyComplete(editingGraphic) {
      var _this3 = this;

      var newGraphic = editingGraphic.clone(); // need a beforeCreate handler, to give chance to modify new graphic
      // and also give chance to stop add graphic

      var beforeComplete = this.options.beforeComplete;

      if (!beforeComplete) {
        beforeComplete = function beforeComplete() {
          return newGraphic;
        };
      }

      var rtn = beforeComplete(newGraphic);

      var _then = function _then(modifiedGraphic) {
        if (modifiedGraphic === false) {
          _this3.state = 'ready';
          return; // stop apply complete
        }

        addGraphic(_this3.sourceLayer, modifiedGraphic || newGraphic);
        _this3.state = 'ready';
      };

      if (rtn && rtn.then) {
        rtn.then(_then);
      } else {
        _then(rtn);
      }
    }
  }, {
    key: "_applyCancel",
    value: function _applyCancel() {
      var sourceLayer = this.sourceLayer,
          sourceGraphic = this.sourceGraphic,
          options = this.options;

      if (sourceGraphic && options.removeOriginalFeatureBeforeUpdate) {
        // for create() has no sourceGraphic
        addGraphic(sourceLayer, sourceGraphic);
      }

      this.state = 'ready';
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents(sketchViewModel) {
      var _this4 = this;

      this._eventHandlers = [sketchViewModel.on(['redo', 'undo', 'create', 'update'], function (e) {
        var editingGraphic = null;

        if (e.type === 'create') {
          editingGraphic = e.graphic;
        } else if (e.type === 'update') {
          editingGraphic = e.graphics[0];
        }

        _this4.editingGraphic = editingGraphic;

        if (!editingGraphic) {
          return;
        }

        editingGraphic.layer = sketchViewModel.layer;

        if (_this4.state === 'complete' && e.state === 'complete') {
          sketchViewModel.layer.removeAll();

          _this4._applyComplete(editingGraphic);
        } else if (_this4.state === 'cancel' && e.state === 'cancel') {
          sketchViewModel.layer.removeAll();

          _this4._applyCancel();
        } else if (['complete', 'cancel'].includes(e.state)) {
          sketchViewModel.update([editingGraphic]);
        }
      })];
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      this._eventHandlers.forEach(function (h) {
        return h.remove();
      });

      this._eventHandlers = [];
    }
  }, {
    key: "_resetSketchViewModel",
    value: function _resetSketchViewModel() {
      if (this.sketchViewModel) {
        this._unbindEvents();

        this.view.map.remove(this.sketchViewModel.layer);
        this.sketchViewModel.layer.removeAll();
        this.sketchViewModel.reset();
        this.sketchViewModel = null;
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._resetSketchViewModel();

      this.view = null;
      this.sketchViewModelProperties = null;
      this.sourceGraphic = null;
      this.editingGraphic = null;
      this.sourceLayer = null;
      this.state = '';
      this.destroyed = true;
    }
    /**
     * for graphicsLayer: create(graphicsLayer, 'polygon')
     * for featureLayer: create(featureLayer) // tool will be inferred with featureLayer.geometryType
     */

  }, {
    key: "create",
    value: function create(sourceLayer, tool) {
      var _this5 = this;

      this.state = 'create';
      this.sourceLayer = sourceLayer;
      this.sourceGraphic = null;

      if (sourceLayer.type === 'feature') {
        tool = sourceLayer.geometryType || tool; // client side featurelayer's geometryType is null before it has any source added
      }

      this._createSketchViewModel().then(function (sketchViewModel) {
        sketchViewModel.create(tool);

        _this5._bindEvents(sketchViewModel);

        _this5.sketchViewModel = sketchViewModel;
      });
    }
    /**
     * update(graphic) // sourceLayer will be use graphic.layer
     * update(sourceLayer, graphic) // or you can specify sourceLayer
     */

  }, {
    key: "update",
    value: function update() {
      var _this6 = this;

      var sourceLayer, graphic;

      if (arguments.length === 1) {
        // update(graphic)
        graphic = arguments.length <= 0 ? undefined : arguments[0];
        sourceLayer = graphic.layer;
      } else if (arguments.length === 0) {
        // update(layer, graphic)
        sourceLayer = arguments.length <= 0 ? undefined : arguments[0];
        graphic = arguments.length <= 1 ? undefined : arguments[1];
      }

      this.state = 'update';
      this.sourceLayer = sourceLayer;
      this.sourceGraphic = graphic;

      this._createSketchViewModel().then(function (sketchViewModel) {
        if (_this6.options.removeOriginalFeatureBeforeUpdate) {
          removeGraphic(sourceLayer, graphic);
        }

        var clonedGraphic = graphic.clone();
        sketchViewModel.layer.add(clonedGraphic);
        clonedGraphic.layer = sketchViewModel.layer; // this has to be set manually, otherwise the sync code after won't see graphic added into the layer

        sketchViewModel.update([clonedGraphic]);

        _this6._bindEvents(sketchViewModel);

        _this6.sketchViewModel = sketchViewModel;
      });
    }
  }, {
    key: "complete",
    value: function complete() {
      this.state = 'complete';
      this.sketchViewModel.complete();
    }
  }, {
    key: "cancel",
    value: function cancel() {
      this.state = 'cancel';
      this.sketchViewModel.cancel();
    }
  }]);

  return Sketch;
}(EventEmitter);

export default Sketch;