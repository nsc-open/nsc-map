import React, { Component } from 'react';
import MapPortal from './MapPortal';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import Draggable from 'react-draggable';
import styles from './MapDraggable.css';
export default (function (_ref) {
  var map = _ref.map,
      view = _ref.view,
      children = _ref.children,
      _ref$direction = _ref.direction,
      direction = _ref$direction === void 0 ? 'horizontal' : _ref$direction,
      _ref$defaultPosition = _ref.defaultPosition,
      defaultPosition = _ref$defaultPosition === void 0 ? {
    x: 100,
    y: 100
  } : _ref$defaultPosition;
  var isHorizontal = direction === 'horizontal';
  return React.createElement(MapPortal, {
    map: map,
    view: view,
    wrapper: false
  }, React.createElement(Draggable, {
    handle: ".".concat(styles.handler),
    defaultPosition: defaultPosition,
    bounds: "parent"
  }, React.createElement("div", {
    className: styles.draggable
  }, React.createElement("div", {
    className: isHorizontal ? styles.layoutHorizontal : styles.layoutVertical
  }, React.createElement("div", {
    className: isHorizontal ? styles.handlerHorizontal : styles.handlerVertical
  }, React.createElement(Icon, {
    type: "drag"
  })), React.createElement("div", {
    className: styles.main
  }, children)))));
});