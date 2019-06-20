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

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { loadModules } from 'esri-module-loader';
import Graphic from '../graphic/Graphic';
/**
 * usage:
 *  <FeatureLayer featureLayerProperties={}>
 *    <Graphic />
 *    <Graphic />
 *  </FeatureLayer>
 */

var FeatureLayer =
/*#__PURE__*/
function (_Component) {
  _inherits(FeatureLayer, _Component);

  function FeatureLayer(props) {
    var _this;

    _classCallCheck(this, FeatureLayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FeatureLayer).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setUncontrolledState", function (state) {
      var needSync = false;
      var newState = {};
      Object.keys(state).forEach(function (name) {
        if (name in _this.props) {
          return;
        }

        needSync = true;
        newState[name] = state[name];
      });

      if (needSync) {
        _this.setState(newState);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "clickHandler", function () {
      var hittedGraphics = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var event = arguments.length > 1 ? arguments[1] : undefined;
      var onSelect = _this.props.onSelect;
      var selectedKeys = hittedGraphics.map(function (g) {
        return g.attributes.key;
      });

      _this.setUncontrolledState({
        selectedKeys: selectedKeys
      });

      onSelect && onSelect(selectedKeys, {
        graphics: hittedGraphics,
        event: event
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "pointerMoveHandler", function () {
      var hittedGraphics = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var event = arguments.length > 1 ? arguments[1] : undefined;
      var _this$props = _this.props,
          view = _this$props.view,
          onHover = _this$props.onHover,
          hoverCursor = _this$props.hoverCursor;
      var keys = hittedGraphics.map(function (g) {
        return g.attributes.key;
      });

      if (hittedGraphics.length > 0) {
        view.cursor = hoverCursor;
        onHover && onHover(keys, {
          graphics: hittedGraphics,
          event: event
        });
      } else {
        view.cursor = 'auto';
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "editHandler", function (event) {
      var onEdit = _this.props.onEdit;
      onEdit && onEdit(event);
    });

    _this.state = {
      layer: null,
      // need to put layer as state, so once layer is created, render would run again
      selectedKeys: [],
      editingKeys: []
    };
    return _this;
  }

  _createClass(FeatureLayer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      loadModules(['FeatureLayer']).then(function (_ref) {
        var FeatureLayer = _ref.FeatureLayer;
        var _this2$props = _this2.props,
            properties = _this2$props.properties,
            onLoad = _this2$props.onLoad;
        var layer = new FeatureLayer(properties);

        _this2.addLayer(layer);

        _this2.setState({
          layer: layer
        });

        _this2.bindEvents();

        onLoad && onLoad(layer);
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unbindEvents();
      this.removeLayer(this.state.layer);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      // only when layer is created, this component should be updated
      // or, this to ensure state.layer always has value in componentDidUpdate
      if (!nextState.layer) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this3 = this;

      var properties = this.props.properties;
      var layer = this.state.layer;

      var needSync = function needSync(name) {
        return !prevProps && name in _this3.props || prevProps && prevProps[name] !== _this3.props[name];
      }; // update graphicsLayer properties


      if (needSync('properties')) {// TODO properties should be considered as static props, set properties automatically would cause featureLayer issue
        // like, source been reset, you need to apply adds again
        // layer.set(properties)
      }
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this4 = this;

      var view = this.props.view;

      var _hitted = function _hitted(results) {
        return results.filter(function (r) {
          return r.graphic.layer === _this4.state.layer;
        }).map(function (r) {
          return r.graphic;
        });
      };

      this.eventHandlers = [view.on('click', function (e) {
        view.hitTest(e).then(function (_ref2) {
          var results = _ref2.results;

          _this4.clickHandler(_hitted(results), e);
        });
      }), view.on('pointer-move', function (e) {
        view.hitTest(e).then(function (_ref3) {
          var results = _ref3.results;

          _this4.pointerMoveHandler(_hitted(results), e);
        });
      })];
    }
  }, {
    key: "unbindEvents",
    value: function unbindEvents() {
      this.eventHandlers.forEach(function (h) {
        return h.remove();
      });
    }
    /**
     * Only update the value which is not in props
     */

  }, {
    key: "addLayer",
    value: function addLayer(layer) {
      var _this$props2 = this.props,
          map = _this$props2.map,
          parentLayer = _this$props2.parentLayer;

      if (parentLayer) {
        console.log('FeatureLayer parentLayer.add(layer)');
        parentLayer.add(layer);
      } else {
        console.log('FeatureLayer map.add(layer)');
        map.add(layer);
      }
    }
  }, {
    key: "removeLayer",
    value: function removeLayer(layer) {
      var _this$props3 = this.props,
          map = _this$props3.map,
          parentLayer = _this$props3.parentLayer;

      if (parentLayer) {
        parentLayer.remove(layer);
      } else {
        map.remove(layer);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var _this$props4 = this.props,
          view = _this$props4.view,
          _this$props4$children = _this$props4.children,
          children = _this$props4$children === void 0 ? [] : _this$props4$children,
          selectable = _this$props4.selectable,
          editable = _this$props4.editable,
          hoverable = _this$props4.hoverable;
      var _this$state = this.state,
          layer = _this$state.layer,
          editingKeys = _this$state.editingKeys,
          selectedKeys = _this$state.selectedKeys;

      if (layer) {
        console.log('FeatureLayer render has layer', this);
        return Children.map(children, function (child) {
          var graphicKey = Graphic.key(child.props.properties || child.props.json);
          return React.cloneElement(child, {
            view: view,
            layer: layer,
            selectable: selectable,
            selected: selectedKeys.includes(graphicKey),
            editable: editable,
            editing: editingKeys.includes(graphicKey),
            onEdit: _this5.editHandler,
            hoverable: hoverable
          });
        });
      } else {
        console.log('FeatureLayer render null');
        return null;
      }
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, prevState) {
      var prevProps = prevState.prevProps;
      var newState = {
        prevProps: props
      };

      var needSync = function needSync(name) {
        return !prevProps && name in props || prevProps && prevProps[name] !== props[name];
      }; // ================ selectedKeys =================


      if (props.selectable) {
        if (needSync('selectedKeys')) {
          newState.selectedKeys = props.selectedKeys;
        }
      } // ================ editingKeys =================


      if (props.editable) {
        if (needSync('editingKeys')) {
          newState.editingKeys = props.editingKeys;
        }
      }

      return newState;
    }
  }]);

  return FeatureLayer;
}(Component);

FeatureLayer.propTypes = {
  map: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  parentLayer: PropTypes.object,
  properties: PropTypes.object,
  onLoad: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
  selectable: PropTypes.bool.isRequired,
  selectedKeys: PropTypes.array,
  onSelect: PropTypes.func,
  hoverable: PropTypes.bool.isRequired,
  hoverCursor: PropTypes.string,
  onHover: PropTypes.func,
  editable: PropTypes.bool,
  editingKeys: PropTypes.array,
  onEdit: PropTypes.func
};
FeatureLayer.defaultProps = {
  children: [],
  properties: null,
  selectable: true,
  hoverable: true,
  hoverCursor: 'pointer',
  editable: true
};
export default FeatureLayer;