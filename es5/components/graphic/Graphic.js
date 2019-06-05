function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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
    _this.stateManager = null;
    return _this;
  }

  _createClass(Graphic, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      window.g = this;
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
      this.stateManager.on('click', function (_ref) {
        var e = _ref.e,
            hit = _ref.hit;

        _this2.onClick(e, hit);
      });
      this.stateManager.on('hover', function (_ref2) {
        var e = _ref2.e,
            hit = _ref2.hit;
        // this.onHover(e, hit)
        view.cursor = hit ? 'pointer' : 'auto';
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stateManager.destroy();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this3 = this;

      var _this$props2 = this.props,
          properties = _this$props2.properties,
          json = _this$props2.json,
          selected = _this$props2.selected,
          selectable = _this$props2.selectable,
          editing = _this$props2.editing;

      var needSync = function needSync(name) {
        return !prevProps && name in _this3.props || prevProps && prevProps[name] !== _this3.props[name];
      }; // graphic instance create or update


      if (needSync('json') || needSync('properties')) {
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


      if (needSync('editing')) {}
    }
  }, {
    key: "render",
    value: function render() {
      console.log('Graphic.render', this.props);
      return null;
    }
  }]);

  return Graphic;
}(Component);

Graphic.propTypes = {
  // esri/Graphic constructor related props
  view: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  properties: PropTypes.object,
  // properties has higher priority than json when constructing a graphic
  json: PropTypes.object,
  // 
  hoverable: PropTypes.bool,
  hoverCursor: PropTypes.string,
  onHover: PropTypes.func,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  editable: PropTypes.bool,
  editing: PropTypes.bool
};
Graphic.defaultProps = {
  properties: null,
  json: null,
  hoverable: true,
  hoverCursor: 'pointer',
  selectable: true,
  selected: false,
  editable: true,
  editing: false,
  onSelect: function onSelect(e, _ref3) {
    var key = _ref3.key,
        graphic = _ref3.graphic,
        selected = _ref3.selected;
  },
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