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
import { loadModules } from 'esri-module-loader';
/**
 * usage:
 *  <GraphicsLayer>
      <Graphic key="" geometryJson={} />
      <Graphic key="" graphicProperties={} />
    </GraphicsLayer>
 */

var Graphic =
/*#__PURE__*/
function (_Component) {
  _inherits(Graphic, _Component);

  function Graphic(props) {
    var _this;

    _classCallCheck(this, Graphic);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Graphic).call(this, props)); // because of componentDidUpdate() won't be triggered for the initial rendering
    // so set graphic as state will solve this problem, once graphic is created and setState, component will trigger componentDidUpdate() automatically
    // otherwise, hightlight logic needs to be there in componentWillMount() for one more time

    _this.state = {
      graphic: null
    };
    return _this;
  }

  _createClass(Graphic, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      // load and add to graphicsLayer/featureLayer
      loadModules(['esri/Graphic']).then(function (_ref) {
        var Graphic = _ref.Graphic;
        var _this2$props = _this2.props,
            graphicProperties = _this2$props.graphicProperties,
            geometryJson = _this2$props.geometryJson;
        var graphic;

        if (geometryJson) {
          graphic = Graphic.fromJSON(geometryJson);
        } else if (graphicProperties) {
          graphic = new Graphic(graphicProperties);
        } else {
          throw new Error('geometryJson and graphicProperties cannot to be empty at the same time');
        }

        _this2.add(graphic);

        _this2.setState({
          graphic: graphic
        });
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.remove(this.state.graphic);
    }
  }, {
    key: "add",
    value: function add(graphic) {
      var layer = this.props.layer;

      if (layer.type === 'graphics') {
        layer.add(graphic);
      } else if (layer.type === 'feature') {
        layer.applyEdits({
          addFeatures: [graphic]
        });
      }
    }
  }, {
    key: "remove",
    value: function remove(graphic) {
      var layer = this.props.layer;

      if (layer.type === 'graphics') {
        layer.remove(graphic);
      } else if (layer.type === 'feature') {
        layer.applyEdits({
          deleteFeatures: [graphic]
        });
      }
    }
  }, {
    key: "update",
    value: function update(graphic) {
      var layer = this.props.layer;

      if (layer.type === 'graphics') {// find by key
        // remove old one
        // add new one
      } else if (layer.type === 'feature') {
        layer.applyEdits({
          updateFeatures: [graphic]
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return Graphic;
}(Component);

Graphic.propTypes = {
  geometryJson: PropTypes.object,
  graphicProperties: PropTypes.object // if geometryJson passed, graphicProperties will be ignored

};
Graphic.defaultProps = {
  geometryJson: null,
  graphicProperties: null
};
export default Graphic;