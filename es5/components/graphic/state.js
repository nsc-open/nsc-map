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

    _this.init();

    return _this;
  }

  _createClass(Initializing, [{
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
    key: "init",
    value: function init() {}
  }, {
    key: "destroy",
    value: function destroy() {}
  }, {
    key: "update",
    value: function update(properties) {
      var _this$stateManager = this.stateManager,
          layer = _this$stateManager.layer,
          graphic = _this$stateManager.graphic;
      utils.updateGraphic(layer, graphic, {
        properties: properties
      });
    }
  }, {
    key: "select",
    value: function select() {
      this.stateManager.changeState('selected');
    }
  }, {
    key: "deselect",
    value: function deselect() {// do nothing
    }
  }, {
    key: "edit",
    value: function edit() {
      this.stateManager.changeState('editing');
    }
  }, {
    key: "quitEdit",
    value: function quitEdit() {// do nothing
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

      console.log('selected.init');
      var _this$stateManager2 = this.stateManager,
          view = _this$stateManager2.view,
          layer = _this$stateManager2.layer,
          graphic = _this$stateManager2.graphic;
      view.whenLayerView(layer).then(function (layerView) {
        console.log('selected.init highlight');
        _this4.highlightHandler = utils.highlight(layerView, [graphic]);
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      console.log('Select destroy', this.highlightHandler);

      if (this.highlightHandler) {
        this.highlightHandler.remove();
        this.highlightHandler = null;
      } // if stored updated symbol, restore it


      if (this.symbolProperty) {//const { layer, graphic } = this.stateManager
        //utils.updateGraphic(layer, graphic, { symbol: this.symbolProperty })
      }
    }
  }, {
    key: "update",
    value: function update(properties) {
      var _this$stateManager3 = this.stateManager,
          layer = _this$stateManager3.layer,
          graphic = _this$stateManager3.graphic; // if trying to change symbol, it will be stored and updated with this symbol after exit this state
      // in this state, symbol won't be change coz it uses the highlight symbol

      if ('symbol' in properties) {
        this.symbolProperty = properties.symbol;
      }

      var geometry = properties.geometry,
          attributes = properties.attributes;
      utils.updateGraphic(layer, graphic, {
        properties: {
          geometry: geometry,
          attributes: attributes
        }
      });
    }
  }, {
    key: "select",
    value: function select() {// do nothing, already in selected state
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
  }, {
    key: "quitEdit",
    value: function quitEdit() {// do nothing
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
    _this5.key = 'editing';
    _this5.clonedGraphic = null;
    _this5.tempGraphicsLayer = null;
    _this5.symbolProperty = null;

    _this5.init();

    return _this5;
  }

  _createClass(Editing, [{
    key: "init",
    value: function init() {// new sketch
    }
  }, {
    key: "destroy",
    value: function destroy() {
      // destroy sketch, clonedGraphic, tempGraphicsLayer
      // if stored updated symbol, restore it
      if (this.symbolProperty) {
        var _this$stateManager4 = this.stateManager,
            layer = _this$stateManager4.layer,
            graphic = _this$stateManager4.graphic;
        utils.updateGraphic(layer, graphic, {
          properties: {
            symbol: this.symbolProperty
          }
        });
      }
    }
  }, {
    key: "update",
    value: function update(properties) {
      var _this$stateManager5 = this.stateManager,
          layer = _this$stateManager5.layer,
          graphic = _this$stateManager5.graphic; // if trying to change symbol, it will be stored and updated with this symbol after exit this state
      // in this state, symbol won't be change coz it uses the highlight symbol

      if ('symbol' in properties) {
        this.symbolProperty = properties.symbol;
      }

      var geometry = properties.geometry,
          attributes = properties.attributes;
      utils.updateGraphic(layer, graphic, {
        properties: {
          geometry: geometry,
          attributes: attributes
        }
      });
    }
  }, {
    key: "select",
    value: function select() {// do nothing
    }
  }, {
    key: "deselect",
    value: function deselect() {// do nothing
    }
  }, {
    key: "edit",
    value: function edit() {// do nothing
    }
  }, {
    key: "quitEdit",
    value: function quitEdit() {
      this.stateManager.changeState(this.stateManager.prevState || 'normal');
    }
  }]);

  return Editing;
}(BaseState);

var StateManager =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(StateManager, _EventEmitter);

  function StateManager(_ref) {
    var _this6;

    var view = _ref.view,
        layer = _ref.layer;

    _classCallCheck(this, StateManager);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(StateManager).call(this));
    _this6.view = view;
    _this6.layer = layer;
    _this6.graphic = null;
    _this6.eventHandlers = [];
    _this6.state = new BaseState();
    return _this6;
  }

  _createClass(StateManager, [{
    key: "init",
    value: function init(_ref2) {
      var _this7 = this;

      var properties = _ref2.properties,
          json = _ref2.json;
      this.changeState('initializing');
      utils.createGraphic({
        properties: properties,
        json: json
      }).then(function (graphic) {
        _this7.graphic = graphic;
        utils.addGraphic(_this7.layer, graphic);

        _this7.bindEvents();

        _this7.changeState('normal');
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.state.destroy();
      this.unbindEvents();
      utils.removeGraphic(this.layer, this.graphic);
    }
  }, {
    key: "update",
    value: function update(params) {
      console.log('update =>');
      this.state.update(params);
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this8 = this;

      var view = this.view,
          graphic = this.graphic;
      this.eventHandlers = [view.on('click', function (e) {
        view.hitTest(e).then(function (_ref3) {
          var results = _ref3.results;
          var hit = results.find(function (r) {
            return r.graphic === graphic;
          });

          _this8.emit('click', {
            e: e,
            hit: hit
          });
        });
      }), view.on('pointer-move', function (e) {
        view.hitTest(e).then(function (_ref4) {
          var results = _ref4.results;
          var hit = results.find(function (r) {
            return r.graphic === graphic;
          });

          _this8.emit('hover', {
            e: e,
            hit: hit
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
        'normal': Normal,
        'initializing': Initializing,
        'editing': Editing,
        'selected': Selected
      }[stateKey];
      this.state = new StateClass(this);
    }
    /***** actions *****/

  }, {
    key: "select",
    value: function select() {
      console.log('select');
      this.state.select();
    }
  }, {
    key: "deselect",
    value: function deselect() {
      console.log('deselect');
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