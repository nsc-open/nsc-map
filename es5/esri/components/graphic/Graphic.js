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

import { Component } from 'react';
import PropTypes from 'prop-types';
import StateManager from './state';
/**
 * usage:
 *  <GraphicsLayer>
      <Graphic key="" json={} />
      <Graphic key="" properties={} />
    </GraphicsLayer>
 */

var Graphic =
/*#__PURE__*/
function (_Component) {
  _inherits(Graphic, _Component);

  function Graphic(props) {
    var _this;

    _classCallCheck(this, Graphic);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Graphic).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "editHandler", function (_ref) {
      var graphic = _ref.graphic,
          event = _ref.event;
      var onEdit = _this.props.onEdit;
      onEdit && onEdit({
        graphic: graphic,
        event: event,
        key: Graphic.key({
          properties: graphic
        })
      });
    });

    _this.stateManager = null;
    return _this;
  }

  _createClass(Graphic, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          view = _this$props.view,
          layer = _this$props.layer,
          properties = _this$props.properties,
          json = _this$props.json;
      this.stateManager = new StateManager({
        view: view,
        layer: layer
      });
      this.stateManager.init({
        properties: properties,
        json: json
      });
      this.stateManager.on('edit', this.editHandler);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stateManager.destroy();
      this.stateManager = null;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;

      var _this$props2 = this.props,
          properties = _this$props2.properties,
          json = _this$props2.json,
          selected = _this$props2.selected,
          selectable = _this$props2.selectable,
          editable = _this$props2.editable,
          editing = _this$props2.editing;

      var needSync = function needSync(name) {
        return !prevProps && name in _this2.props || prevProps && prevProps[name] !== _this2.props[name];
      }; // graphic instance create or update


      if (needSync('json') || needSync('properties')) {
        console.log('needsync json or pro');
        this.stateManager.update({
          properties: properties,
          json: json
        });
      } // process selected


      if (selectable) {
        if (needSync('selected') && selected) {
          this.stateManager.select();
        } else if (needSync('selected') && !selected) {
          this.stateManager.deselect();
        }
      } // edit


      if (editable) {
        if (needSync('editing')) {
          if (editing) {
            this.stateManager.edit();
          } else {
            this.stateManager.quitEdit();
          }
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      console.log('Graphic.render', this);
      return null;
    }
  }]);

  return Graphic;
}(Component);

Graphic.propTypes = {
  // construction related
  view: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  properties: PropTypes.object,
  // properties has higher priority than json
  json: PropTypes.object,
  // hover related
  hoverable: PropTypes.bool,
  // select related
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  // edit related
  editable: PropTypes.bool,
  editing: PropTypes.bool,
  onEdit: PropTypes.func
};
Graphic.defaultProps = {
  hoverable: true,
  selectable: true,
  selected: false,
  editable: true,
  editing: false,
  onEdit: null
};
var KEY_ATTRIBUTE = 'key';
Graphic.keyAttribute = KEY_ATTRIBUTE;
export var config = function config(_ref2) {
  var keyAttribute = _ref2.keyAttribute;
  Graphic.keyAttribute = keyAttribute;
};
export var key = function key(graphic) {
  var attributes = graphic.attributes || {};
  return attributes[Graphic.keyAttribute];
};
Graphic.config = config;
Graphic.key = key;
export default Graphic;