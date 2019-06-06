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
var KEY_ATTRIBUTE = 'key';
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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "selectHandler", function (_ref) {
      var event = _ref.event,
          graphic = _ref.graphic,
          selected = _ref.hit;
      var onSelect = _this.props.onSelect;
      onSelect && onSelect({
        selected: selected,
        graphic: graphic,
        event: event,
        key: Graphic.getKey({
          properties: graphic
        })
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "hoverHandler", function (_ref2) {
      var event = _ref2.event,
          graphic = _ref2.graphic,
          hover = _ref2.hit;
      var _this$props = _this.props,
          hoverable = _this$props.hoverable,
          onHover = _this$props.onHover;

      if (hoverable) {
        onHover && onHover({
          hover: hover,
          graphic: graphic,
          event: event,
          key: Graphic.getKey({
            properties: graphic
          })
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "editHandler", function (_ref3) {
      var graphic = _ref3.graphic,
          event = _ref3.event;
      var onEdit = _this.props.onEdit;
      onEdit && onEdit({
        graphic: graphic,
        event: event,
        key: Graphic.getKey({
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
      var _this$props2 = this.props,
          view = _this$props2.view,
          layer = _this$props2.layer,
          properties = _this$props2.properties,
          json = _this$props2.json;
      this.stateManager = new StateManager({
        view: view,
        layer: layer
      });
      this.stateManager.init({
        properties: properties,
        json: json
      });
      this.stateManager.on('select', this.selectHandler);
      this.stateManager.on('hover', this.hoverHandler);
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

      var _this$props3 = this.props,
          properties = _this$props3.properties,
          json = _this$props3.json,
          selected = _this$props3.selected,
          selectable = _this$props3.selectable,
          editable = _this$props3.editable,
          editing = _this$props3.editing;

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
          console.log('needsync editing');
          return;

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
  hoverCursor: PropTypes.string,
  onHover: PropTypes.func,
  // select related
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  // edit related
  editable: PropTypes.bool,
  editing: PropTypes.bool,
  onEdit: PropTypes.func
};
Graphic.defaultProps = {
  hoverable: true,
  hoverCursor: 'pointer',
  onHover: null,
  selectable: true,
  selected: false,
  onSelect: null,
  editable: true,
  editing: false,
  onEdit: null
};
Graphic.keyAttribute = KEY_ATTRIBUTE;

Graphic.getKey = function (props) {
  var _ref4 = props.properties || props.json,
      _ref4$attributes = _ref4.attributes,
      attributes = _ref4$attributes === void 0 ? {} : _ref4$attributes;

  return attributes.key;
};

export default Graphic;