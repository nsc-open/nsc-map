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
import * as utils from './utils';
var KEY_ATTRIBUTE = 'key';

var createGraphic = function createGraphic(_ref) {
  var properties = _ref.properties,
      json = _ref.json;
  return loadModules(['esri/Graphic']).then(function (_ref2) {
    var Graphic = _ref2.Graphic;

    if (properties) {
      return new Graphic(properties);
    } else if (json) {
      return Graphic.fromJSON(json);
    } else {
      throw new Error('properties and json cannot to be empty at the same time');
    }
  });
};
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

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Graphic).call(this, props)); // because of componentDidUpdate() won't be triggered for the initial rendering
    // so set graphic as state will solve this problem, once graphic is created and setState, component will trigger componentDidUpdate() automatically
    // otherwise, hightlight logic needs to be there in componentWillMount() for one more time

    _this.state = {
      graphic: null
    };
    _this.highlightHandler = null;
    _this.eventHandlers = [];
    return _this;
  }

  _createClass(Graphic, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // load and add to graphicsLayer/featureLayer
      var _this$props = this.props,
          properties = _this$props.properties,
          json = _this$props.json;
      createGraphic({
        properties: properties,
        json: json
      }).then(function (graphic) {
        _this2.setState({
          graphic: graphic
        });

        _this2.add(graphic);
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var graphic = this.state.graphic;

      if (graphic) {
        this.remove(graphic);
        this.highlightHandler = null;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this3 = this;

      var prevGraphic = prevState.graphic;
      var _this$props2 = this.props,
          properties = _this$props2.properties,
          json = _this$props2.json,
          selected = _this$props2.selected,
          selectable = _this$props2.selectable;

      var needSync = function needSync(name) {
        return !prevProps && name in _this3.props || prevProps && prevProps[name] !== _this3.props[name];
      };

      if (prevGraphic) {
        if (needSync('properties')) {
          this.update(prevGraphic, properties);
        } else if (needSync('json')) {
          createGraphic({
            properties: properties,
            json: json
          }).then(function (graphic) {
            _this3.setState({
              graphic: graphic
            }, function () {
              _this3.replace(graphic, prevGraphic);
            });
          });
        }
      } // process selected


      if (selectable) {
        if (selected && !this.highlightHandler) {
          this.highlight();
        } else if (!selected && this.highlightHandler) {
          this.clearHighlight();
        }
      } else {
        this.clearHighlight();
      }
    }
  }, {
    key: "bindEvents",
    value: function bindEvents(graphic) {
      var _this4 = this;

      var view = this.props.view;
      this.eventHandlers = [view.on('click', function (e) {
        view.hitTest(e).then(function (_ref3) {
          var results = _ref3.results;
          var clicked = results.find(function (r) {
            return r.graphic === graphic;
          });

          if (clicked) {
            _this4.onClick(e);
          }
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
    key: "onClick",
    value: function onClick(e) {
      var _this$props3 = this.props,
          onClick = _this$props3.onClick,
          onSelect = _this$props3.onSelect,
          selected = _this$props3.selected,
          selectable = _this$props3.selectable;
      var graphic = this.state.graphic;
      onClick && onClick(e);

      if (!selectable) {
        return;
      }

      onSelect && onSelect(e, this);
    }
  }, {
    key: "highlight",
    value: function highlight() {
      var _this5 = this;

      var _this$props4 = this.props,
          view = _this$props4.view,
          layer = _this$props4.layer;
      var graphic = this.state.graphic;
      view.whenLayerView(layer).then(function (layerView) {
        _this5.highlightHandler = utils.highlight(layerView, [graphic]);
      });
    }
  }, {
    key: "clearHighlight",
    value: function clearHighlight() {
      this.highlightHandler.remove();
      this.highlightHandler = null;
    }
  }, {
    key: "add",
    value: function add(graphic) {
      console.log('add graphic');
      var layer = this.props.layer;

      if (layer.type === 'graphics') {
        layer.add(graphic);
      } else if (layer.type === 'feature') {
        layer.applyEdits({
          addFeatures: [graphic]
        });
      }

      this.bindEvents(graphic);
    }
  }, {
    key: "remove",
    value: function remove(graphic) {
      console.log('remove graphic');
      var layer = this.props.layer;

      if (layer.type === 'graphics') {
        layer.remove(graphic);
      } else if (layer.type === 'feature') {
        layer.applyEdits({
          deleteFeatures: [graphic]
        });
      }

      this.unbindEvents();
    }
  }, {
    key: "update",
    value: function update(graphic, properties) {
      console.log('update graphic');
      graphic.set(properties);
    }
    /**
     * remove old graphic and add a new one
     * events will be binded again
     */

  }, {
    key: "replace",
    value: function replace(graphic, oldGraphic) {
      console.log('replace graphic');
      var _this$props5 = this.props,
          layer = _this$props5.layer,
          selected = _this$props5.selected;
      this.unbindEvents();
      selected && this.clearHighlight();

      if (layer.type === 'graphics') {
        layer.remove(oldGraphic);
        layer.add(graphic);
      } else if (layer.type === 'feature') {
        layer.applyEdits({
          deleteFeatures: [oldGraphic],
          addFeatures: [graphic]
        });
      }

      this.bindEvents(graphic);
      selected && this.highlight();
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
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  editable: PropTypes.bool,
  editing: PropTypes.bool
};
Graphic.defaultProps = {
  properties: null,
  json: null,
  selectable: true,
  selected: false,
  editable: true,
  editing: false
};
Graphic.keyAttribute = KEY_ATTRIBUTE;

Graphic.getKey = function (props) {
  var _ref4 = props.properties || props.json,
      _ref4$attributes = _ref4.attributes,
      attributes = _ref4$attributes === void 0 ? {} : _ref4$attributes;

  return attributes.key;
};

export default Graphic;