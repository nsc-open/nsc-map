function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import MapPortal from './MapPortal';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import Draggable from 'react-draggable'; // import styles from './MapDraggable.css'

const styles = {
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
    minHeight: '100px'
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
  main: {// padding: '6px 8px'
  }
};
export default (({
  map,
  view,
  zIndex,
  children,
  direction = 'horizontal',
  defaultPosition = {
    x: 100,
    y: 100
  }
}) => {
  const isHorizontal = direction === 'horizontal';
  return React.createElement(MapPortal, {
    map: map,
    view: view
  }, React.createElement(Draggable, {
    handle: `.handler`,
    defaultPosition: defaultPosition,
    bounds: "parent"
  }, React.createElement("div", {
    style: _objectSpread({}, styles.draggable, {
      zIndex
    })
  }, React.createElement("div", {
    style: isHorizontal ? styles.layoutHorizontal : styles.layoutVertical
  }, React.createElement("div", {
    className: "handler",
    style: isHorizontal ? styles.handlerHorizontal : styles.handlerVertical
  }, React.createElement(Icon, {
    type: "drag"
  })), React.createElement("div", {
    style: styles.main
  }, children)))));
});