function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import MapPortal from './MapPortal';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import Draggable from 'react-draggable'; // import styles from './MapDraggable.css'

var styles = {
  draggable: {
    position: 'absolute',
    zIndex: 50,
    display: 'inline-block',
    borderRadius: '2px',
    background: '#fafafa',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
  },
  layoutHorizontal: {
    display: 'flex',
    flexDirection: 'row',
    minWidth: '100px'
  },
  layoutVertical: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '20px'
  },
  handlerHorizontal: {
    cursor: 'move',
    padding: '6px 8px',
    borderRight: '1px solid #e8e8e8'
  },
  handlerVertical: {
    cursor: 'move',
    padding: '4px 8px',
    borderBottom: '1px solid #e8e8e8'
  },
  main: {
    padding: '6px 8px'
  }
};
export default (function (_ref) {
  var map = _ref.map,
      view = _ref.view,
      zIndex = _ref.zIndex,
      children = _ref.children,
      _ref$direction = _ref.direction,
      direction = _ref$direction === void 0 ? 'horizontal' : _ref$direction,
      _ref$defaultPosition = _ref.defaultPosition,
      defaultPosition = _ref$defaultPosition === void 0 ? {
    x: 100,
    y: 100
  } : _ref$defaultPosition;
  var isHorizontal = direction === 'horizontal';
  return /*#__PURE__*/React.createElement(MapPortal, {
    map: map,
    view: view
  }, /*#__PURE__*/React.createElement(Draggable, {
    handle: ".handler",
    defaultPosition: defaultPosition,
    bounds: "parent"
  }, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, styles.draggable), {}, {
      zIndex: zIndex
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: isHorizontal ? styles.layoutHorizontal : styles.layoutVertical
  }, /*#__PURE__*/React.createElement("div", {
    className: "handler",
    style: isHorizontal ? styles.handlerHorizontal : styles.handlerVertical
  }, /*#__PURE__*/React.createElement(Icon, {
    type: "drag"
  })), /*#__PURE__*/React.createElement("div", {
    style: styles.main
  }, children)))));
});