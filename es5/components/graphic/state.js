function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import EventEmitter from 'eventemitter3';
import { loadModules } from 'esri-module-loader';
import * as utils from './utils';

var BaseState =
/*#__PURE__*/
function () {
  function BaseState(stateMananger) {
    _classCallCheck(this, BaseState);

    this.stateManager = stateMananger;
    this.key = 'base';
  }

  _createClass(BaseState, [{
    key: "init",
    value: function init() {}
  }, {
    key: "destroy",
    value: function destroy() {}
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "select",
    value: function select() {}
  }, {
    key: "deselect",
    value: function deselect() {}
  }, {
    key: "edit",
    value: function edit() {}
  }, {
    key: "quitEdit",
    value: function quitEdit() {}
  }]);

  return BaseState;
}();

var Initializing =
/*#__PURE__*/
function (_BaseState) {
  _inherits(Initializing, _BaseState);

  function Initializing(props) {
    var _this;

    _classCallCheck(this, Initializing);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Initializing).call(this, props));
    _this.key = 'initializing';
    return _this;
  }

  return Initializing;
}(BaseState);

var Normal =
/*#__PURE__*/
function (_BaseState2) {
  _inherits(Normal, _BaseState2);

  function Normal(props) {
    var _this2;

    _classCallCheck(this, Normal);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Normal).call(this, props));
    _this2.key = 'normal';

    _this2.init();

    return _this2;
  }

  _createClass(Normal, [{
    key: "update",
    value: function update(properties) {
      var _this$stateManager = this.stateManager,
          layer = _this$stateManager.layer,
          graphic = _this$stateManager.graphic;
      utils.updateGraphic(layer, graphic, properties);
    }
  }, {
    key: "select",
    value: function select() {
      this.stateManager.changeState('selected');
    }
  }, {
    key: "edit",
    value: function edit() {
      this.stateManager.changeState('editing');
    }
  }]);

  return Normal;
}(BaseState);

var Selected =
/*#__PURE__*/
function (_BaseState3) {
  _inherits(Selected, _BaseState3);

  function Selected(props) {
    var _this3;

    _classCallCheck(this, Selected);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Selected).call(this, props));
    _this3.key = 'selected';
    _this3.highlightHandler = null;
    _this3.symbolProperty = null;

    _this3.init();

    return _this3;
  }

  _createClass(Selected, [{
    key: "init",
    value: function init() {
      var _this4 = this;

      var _this$stateManager2 = this.stateManager,
          view = _this$stateManager2.view,
          layer = _this$stateManager2.layer,
          graphic = _this$stateManager2.graphic;
      view.whenLayerView(layer).then(function (layerView) {
        _this4.highlightHandler = utils.highlight(layerView, [graphic]);
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.highlightHandler) {
        this.highlightHandler.remove();
        this.highlightHandler = null;
      } // if stored updated symbol, restore it


      if (this.symbolProperty) {
        var _this$stateManager3 = this.stateManager,
            layer = _this$stateManager3.layer,
            graphic = _this$stateManager3.graphic;
        utils.updateGraphic(layer, graphic, {
          symbol: this.symbolProperty
        });
        this.symbolProperty = null;
      }
    }
  }, {
    key: "update",
    value: function update(properties) {
      var _this$stateManager4 = this.stateManager,
          layer = _this$stateManager4.layer,
          graphic = _this$stateManager4.graphic; // if trying to change symbol, it will be stored and updated with this symbol after exit this state
      // in this state, symbol won't be change coz it uses the highlight symbol

      if ('symbol' in properties) {
        this.symbolProperty = properties.symbol;
      }

      var geometry = properties.geometry,
          attributes = properties.attributes;
      utils.updateGraphic(layer, graphic, {
        geometry: geometry,
        attributes: attributes
      });
    }
  }, {
    key: "deselect",
    value: function deselect() {
      this.stateManager.changeState('normal');
    }
  }, {
    key: "edit",
    value: function edit() {
      this.stateManager.changeState('editing');
    }
  }]);

  return Selected;
}(BaseState); // graphic 发生变化时，需要更新 tempGraphicsLayer 中的 clonedGraphic


var Editing =
/*#__PURE__*/
function (_BaseState4) {
  _inherits(Editing, _BaseState4);

  function Editing(props) {
    var _this5;

    _classCallCheck(this, Editing);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Editing).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this5)), "sketchEventHandler", function (e) {
      var graphic = e.graphics[0];

      if (e.state === 'active' && e.toolEventInfo && e.toolEventInfo.type.endsWith('-start')) {
        _this5.editing = true;
      } else if (e.toolEventInfo && e.toolEventInfo.type.endsWith('-stop')) {
        _this5.editing = false;
      }

      if (_this5.editing) {
        // emit only when there is sketch update happened (geometry updated)
        _this5.stateManager.emit('edit', {
          graphic: graphic,
          event: e
        });
      }
    });

    _this5.key = 'editing';
    _this5.clonedGraphic = null;
    _this5.tempGraphicsLayer = null;
    _this5.symbolProperty = null;
    _this5.sketch = null;
    _this5.editing = false;
    _this5.destroying = false;
    _this5.selected = false;

    _this5.init();

    return _this5;
  }

  _createClass(Editing, [{
    key: "init",
    value: function init() {
      var _this6 = this;

      // new sketch
      loadModules(['esri/widgets/Sketch/SketchViewModel', 'esri/layers/GraphicsLayer']).then(function (_ref) {
        var SketchViewModel = _ref.SketchViewModel,
            GraphicsLayer = _ref.GraphicsLayer;

        if (_this6.destroying) {
          return; // before modules loaded, destroy might be called
        }

        var _this6$stateManager = _this6.stateManager,
            view = _this6$stateManager.view,
            graphic = _this6$stateManager.graphic,
            layer = _this6$stateManager.layer;
        var tempGraphicsLayer = new GraphicsLayer();
        var clonedGraphic = graphic.clone();
        view.map.add(tempGraphicsLayer);
        tempGraphicsLayer.add(clonedGraphic);
        utils.hideGraphic(layer, graphic);
        var sketch = new SketchViewModel({
          view: view,
          layer: tempGraphicsLayer,
          updateOnGraphicClick: false,
          defaultUpdateOptions: {
            tool: 'reshape'
          }
        }); // have to do the update async, otherwise sketch would not able to see clonedGraphic added into the layer

        setTimeout(function () {
          return sketch.update([clonedGraphic]);
        }, 0);
        sketch.on(['update', 'undo', 'redo'], _this6.sketchEventHandler);
        _this6.tempGraphicsLayer = tempGraphicsLayer;
        _this6.clonedGraphic = clonedGraphic;
        _this6.sketch = sketch;
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      // destroy sketch, clonedGraphic, tempGraphicsLayer
      var _this$stateManager5 = this.stateManager,
          view = _this$stateManager5.view,
          graphic = _this$stateManager5.graphic,
          layer = _this$stateManager5.layer;
      this.destroying = true;

      if (layer.type === 'feature') {
        // need to apply update from clonedGraphic to feature
        utils.showGraphic(layer, graphic); // need to restore the hidden feature firts, otherwise not able to do the update later

        utils.updateGraphic(layer, graphic, {
          geometry: this.clonedGraphic.geometry
        }); // update the feature the sketched geometry
      } // if stored updated symbol, restore it


      if (this.symbolProperty) {
        utils.updateGraphic(layer, graphic, {
          symbol: this.symbolProperty
        });
      }

      this.tempGraphicsLayer.remove(this.clonedGraphic);
      view.map.remove(this.tempGraphicsLayer);
      this.sketch.cancel();
      this.sketch = null;
      this.tempGraphicsLayer = null;
      this.clonedGraphic = null;
      this.symbolProperty = null;
    }
  }, {
    key: "update",
    value: function update(properties) {
      var _this$stateManager6 = this.stateManager,
          layer = _this$stateManager6.layer,
          graphic = _this$stateManager6.graphic; // if trying to change symbol, it will be stored and updated with this symbol after exit this state
      // in this state, symbol won't be change coz it uses the highlight symbol

      if ('symbol' in properties) {
        this.symbolProperty = properties.symbol;
      } // update origin graphic


      var geometry = properties.geometry,
          attributes = properties.attributes;
      utils.updateGraphic(layer, graphic, {
        geometry: geometry,
        attributes: attributes
      }); // update clonedGraphic

      if (this.editing) {// if the update is caused by sketch.update, then ignore the clonedGraphic update
      } else {
        // if the update is caused from outside (not from the sketch update), need to update clonedGraphic, and make it sketch update mode again
        this.sketch.cancel();
        utils.updateGraphic(this.tempGraphicsLayer, this.clonedGraphic, {
          geometry: geometry,
          attributes: attributes
        });
        this.sketch.update([this.clonedGraphic]);
      }
    }
  }, {
    key: "select",
    value: function select() {
      this.selected = true;
    }
  }, {
    key: "deselect",
    value: function deselect() {
      this.selected = false;
    }
  }, {
    key: "quitEdit",
    value: function quitEdit() {
      this.stateManager.changeState(this.selected ? 'selected' : 'normal');
    }
  }]);

  return Editing;
}(BaseState);
/**
 * events: 
 *    select: ({ e, hit }) => {}
 *    hover: ()
 *    edit
 */


var StateManager =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(StateManager, _EventEmitter);

  function StateManager(_ref2) {
    var _this7;

    var view = _ref2.view,
        layer = _ref2.layer;

    _classCallCheck(this, StateManager);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(StateManager).call(this));
    _this7.view = view;
    _this7.layer = layer;
    _this7.graphic = null;
    _this7.eventHandlers = [];
    _this7.destroying = false;
    _this7.state = new BaseState();
    return _this7;
  }

  _createClass(StateManager, [{
    key: "init",
    value: function init(_ref3) {
      var _this8 = this;

      var properties = _ref3.properties,
          json = _ref3.json;
      this.changeState('initializing');
      utils.createGraphic({
        properties: properties,
        json: json
      }).then(function (graphic) {
        if (_this8.destroying) {
          return;
        }

        _this8.graphic = graphic;
        utils.addGraphic(_this8.layer, graphic);

        _this8.bindEvents();

        _this8.changeState('normal');
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.destroying = true;
      this.state.destroy();
      this.unbindEvents();
      utils.removeGraphic(this.layer, this.graphic);
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this9 = this;

      var view = this.view,
          graphic = this.graphic;

      var isSame = function isSame(g1, g2) {
        if (_this9.layer.type === 'graphics') {
          return g1 === g2;
        } else if (_this9.layer.type === 'feature') {
          return g1.attributes.key === g2.attributes.key;
        }
      };

      this.eventHandlers = [view.on('click', function (e) {
        view.hitTest(e).then(function (_ref4) {
          var results = _ref4.results;
          var hit = !!results.find(function (r) {
            return isSame(r.graphic, graphic);
          });

          _this9.emit('select', {
            event: e,
            hit: hit,
            graphic: graphic
          });
        });
      }), view.on('pointer-move', function (e) {
        view.hitTest(e).then(function (_ref5) {
          var results = _ref5.results;
          var hit = !!results.find(function (r) {
            return isSame(r.graphic, graphic);
          });

          _this9.emit('hover', {
            event: e,
            hit: hit,
            graphic: graphic
          });
        });
      })];
    }
  }, {
    key: "unbindEvents",
    value: function unbindEvents() {
      this.eventHandlers.forEach(function (h) {
        return h.remove();
      });
      this.eventHandlers = [];
    }
  }, {
    key: "changeState",
    value: function changeState(stateKey) {
      if (this.state) {
        this.prevState = this.state.key;
        this.state.destroy();
      }

      var StateClass = {
        'initializing': Initializing,
        'normal': Normal,
        'selected': Selected,
        'editing': Editing
      }[stateKey];
      console.log("changeState ======> ".concat(this.state.key, " from to ").concat(stateKey), this.graphic);
      this.state = new StateClass(this);
    }
    /***** actions *****/

  }, {
    key: "update",
    value: function update(_ref6) {
      var _this10 = this;

      var properties = _ref6.properties,
          json = _ref6.json;

      if (properties) {
        this.state.update(properties);
      } else {
        utils.json2Properties(json).then(function (properties) {
          _this10.state.update(properties);
        });
      }
    }
  }, {
    key: "select",
    value: function select() {
      this.state.select();
    }
  }, {
    key: "deselect",
    value: function deselect() {
      this.state.deselect();
    }
  }, {
    key: "edit",
    value: function edit() {
      this.state.edit();
    }
  }, {
    key: "quitEdit",
    value: function quitEdit() {
      this.state.quitEdit();
    }
  }]);

  return StateManager;
}(EventEmitter);

export { StateManager as default };