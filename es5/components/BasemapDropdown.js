function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
import { Dropdown, Button, Icon, Menu } from 'antd';
import BasemapManager from '../core/BasemapManager';
var TIANDITU_TOKEN = 'e2b08de0708e5136fff0fccaf21dd9bd';
var LAYERS = {
  /* GOOGLE_MAP: {
    urlTemplate: 'http://mt{subDomain}.google.cn/vt/lyrs=s&x={col}&y={row}&z={level}&s=Gali',
    subDomains: '0123'.split('')
  }, */
  // 20210111 google banned since today, use tianditu instead
  GOOGLE_MAP: {
    urlTemplate: "http://t{subDomain}.tianditu.com/DataServer?tk=".concat(TIANDITU_TOKEN, "&T=vec_w&x={col}&y={row}&l={level}"),
    subDomains: '01234567'.split('')
  },
  TIANDITU_MAP: {
    urlTemplate: "http://t{subDomain}.tianditu.com/DataServer?tk=".concat(TIANDITU_TOKEN, "&T=vec_w&x={col}&y={row}&l={level}"),
    subDomains: '01234567'.split('')
  },
  TIANDITU_ANNOTATION: {
    urlTemplate: "http://t{subDomain}.tianditu.com/DataServer?tk=".concat(TIANDITU_TOKEN, "&T=cia_w&x={col}&y={row}&l={level}"),
    subDomains: '01234567'.split('')
  }
};
var BASEMAPS = [{
  id: 'statellite',
  label: '卫星影像',
  mapLayer: LAYERS.GOOGLE_MAP,
  annotationLayer: LAYERS.TIANDITU_ANNOTATION
}, {
  id: 'map',
  label: '电子地图',
  mapLayer: LAYERS.TIANDITU_MAP,
  annotationLayer: LAYERS.TIANDITU_ANNOTATION
}];

var BaseMapSelector = /*#__PURE__*/function (_Component) {
  _inherits(BaseMapSelector, _Component);

  var _super = _createSuper(BaseMapSelector);

  function BaseMapSelector(props) {
    var _this;

    _classCallCheck(this, BaseMapSelector);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "handleMenuClick", function (_ref) {
      var key = _ref.key;
      var showAnnotation = _this.state.showAnnotation;

      if (key === 'annotation') {
        _this.setState({
          showAnnotation: !showAnnotation
        });
      } else {
        _this.setState({
          currentBasemapId: key
        });
      }
    });

    _this.state = {
      currentBasemapId: '',
      showAnnotation: false
    };
    return _this;
  }

  _createClass(BaseMapSelector, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        currentBasemapId: BASEMAPS[0].id,
        showAnnotation: false
      });
      this.basemapManager = new BasemapManager({
        map: this.props.map,
        basemaps: BASEMAPS
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$state = this.state,
          currentBasemapId = _this$state.currentBasemapId,
          showAnnotation = _this$state.showAnnotation;

      if (currentBasemapId === 'statellite') {
        this.basemapManager.showSatellite();
      } else {
        this.basemapManager.showMap();
      }

      if (showAnnotation) {
        this.basemapManager.showAnnotation();
      } else {
        this.basemapManager.hideAnnotation();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state2 = this.state,
          currentBasemapId = _this$state2.currentBasemapId,
          showAnnotation = _this$state2.showAnnotation;
      var currentBasemap = BASEMAPS.find(function (b) {
        return b.id === currentBasemapId;
      });
      var menu = /*#__PURE__*/React.createElement(Menu, {
        onClick: this.handleMenuClick
      }, BASEMAPS.map(function (basemap) {
        return /*#__PURE__*/React.createElement(Menu.Item, {
          key: basemap.id
        }, basemap.label, " ", currentBasemapId === basemap.id && /*#__PURE__*/React.createElement(Icon, {
          type: "check"
        }));
      }), /*#__PURE__*/React.createElement(Menu.Divider, null), /*#__PURE__*/React.createElement(Menu.Item, {
        key: "annotation"
      }, "\u663E\u793A\u6CE8\u8BB0 ", showAnnotation && /*#__PURE__*/React.createElement(Icon, {
        type: "check"
      })));
      return /*#__PURE__*/React.createElement(Dropdown, {
        overlay: menu
      }, /*#__PURE__*/React.createElement(Button, null, currentBasemap && currentBasemap.label, " ", /*#__PURE__*/React.createElement(Icon, {
        type: "down"
      })));
    }
  }]);

  return BaseMapSelector;
}(Component);

BaseMapSelector.propTypes = {
  map: PropTypes.object
};
export default BaseMapSelector;