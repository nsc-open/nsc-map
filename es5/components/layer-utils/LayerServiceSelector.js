function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, Switch, List } from 'antd';
import LayerLocator from './LayerLocator';
import { createLayerServiceInstance } from '../../utils/layer-service';
var ButtonGroup = Button.Group;

var defaultLayerLoader = function defaultLayerLoader(map, layer) {
  createLayerServiceInstance(layer).then(function (layerServiceInstance) {
    layerServiceInstance.visible = layer.visible;
    map.add(layerServiceInstance);
  });
};

var setLayerVisibility = function setLayerVisibility(map, layerId, visibility) {
  var layer = map.findLayerById(layerId);
  layer && (layer.visible = visibility);
};
/**
 * LayerServiceSelector
 * it's an uncontrolled component, you cannot get selected layer status from outside (for now)
 * 
 * usage:
 *    <LayerServiceSelector map view categories layers />
 */


var LayerServiceSelector = /*#__PURE__*/function (_Component) {
  _inherits(LayerServiceSelector, _Component);

  var _super = _createSuper(LayerServiceSelector);

  function LayerServiceSelector(props) {
    var _this;

    _classCallCheck(this, LayerServiceSelector);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "switchHandler", function (layer) {
      var map = _this.props.map;
      var selectedLayerIds = _this.state.selectedLayerIds;
      var newSelectedLayerIds;
      var checked;

      if (!selectedLayerIds.includes(layer.id)) {
        newSelectedLayerIds = [].concat(_toConsumableArray(selectedLayerIds), [layer.id]);
        checked = true;
      } else {
        newSelectedLayerIds = selectedLayerIds.filter(function (k) {
          return k !== layer.id;
        });
        checked = false;
      }

      _this.setState({
        selectedLayerIds: newSelectedLayerIds
      });

      setLayerVisibility(map, layer.id, checked);
    });

    _defineProperty(_assertThisInitialized(_this), "locateHandler", function (layer) {
      var map = _this.props.map;
      var selectedLayerIds = _this.state.selectedLayerIds;

      if (!selectedLayerIds.includes(layer.id)) {
        _this.setState({
          selectedLayerIds: [].concat(_toConsumableArray(selectedLayerIds), [layer.id])
        });

        setLayerVisibility(map, layer.id, true);
      }
    });

    _this.state = {
      selectedLayerIds: props.layers.filter(function (l) {
        return l.visible;
      }).map(function (l) {
        return l.id;
      })
    };
    return _this;
  }

  _createClass(LayerServiceSelector, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.addLayers(this.props.layers);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.removeLayers(this.props.layers);
    }
  }, {
    key: "addLayers",
    value: function addLayers(layers) {
      var _this$props = this.props,
          layerLoader = _this$props.layerLoader,
          map = _this$props.map;
      layers.forEach(function (layer) {
        return layerLoader(map, layer);
      });
    }
  }, {
    key: "removeLayers",
    value: function removeLayers(layers) {
      var map = this.props.map;
      var layerInstances = [];
      layers.forEach(function (l) {
        var layer = map.findLayerById(l.id);

        if (layer) {
          layerInstances.push(layer);
        }
      });
      map.removeMany(layerInstances);
    }
  }, {
    key: "renderPopoverContent",
    value: function renderPopoverContent(categoryId) {
      var _this2 = this;

      var _this$props2 = this.props,
          layers = _this$props2.layers,
          map = _this$props2.map,
          view = _this$props2.view;
      var selectedLayerIds = this.state.selectedLayerIds;
      var matched = layers.filter(function (layer) {
        return layer.categoryId === categoryId;
      });

      if (matched.length === 0) {
        return /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: '12px',
            color: 'rgba(0,0,0,.4)'
          }
        }, "\u8BE5\u5206\u7C7B\u4E0B\u65E0\u56FE\u5C42");
      } else {
        return /*#__PURE__*/React.createElement(List, {
          size: "small",
          bordered: true,
          dataSource: matched,
          renderItem: function renderItem(item) {
            return /*#__PURE__*/React.createElement(List.Item, {
              actions: [/*#__PURE__*/React.createElement(Switch, {
                checked: selectedLayerIds.includes(item.id),
                onChange: function onChange() {
                  return _this2.switchHandler(item);
                }
              }), /*#__PURE__*/React.createElement(LayerLocator, {
                map: map,
                view: view,
                layerId: item.id,
                onLocate: function onLocate() {
                  return _this2.locateHandler(item);
                }
              })]
            }, item.name);
          }
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var categories = this.props.categories;

      if (categories.length === 0) {
        return null;
      } else {
        return /*#__PURE__*/React.createElement(ButtonGroup, null, categories.map(function (category, index) {
          return /*#__PURE__*/React.createElement(Popover, {
            key: index,
            content: _this3.renderPopoverContent(category.id),
            title: category.name,
            placement: "bottomRight"
          }, /*#__PURE__*/React.createElement(Button, null, category.name));
        }));
      }
    }
  }]);

  return LayerServiceSelector;
}(Component);

LayerServiceSelector.propTypes = {
  map: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  // [{ id, name }]
  layers: PropTypes.array.isRequired,
  // [{ id, name, categoryId, url, type<tiled|dynamic>, visible, sortNo }]
  layerLoader: PropTypes.func.isRequired // (map, layer) => {}

};
LayerServiceSelector.defaultProps = {
  map: undefined,
  view: undefined,
  categories: [],
  layers: [],
  layerLoader: defaultLayerLoader
};
export default LayerServiceSelector;