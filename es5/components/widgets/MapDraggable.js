import React, { Component } from 'react';
import MapPortal from '@/components/MapPortal';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import Draggable from 'react-draggable';
import styles from './MapDraggable.css';
export default (({
  map,
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
    wrapper: false
  }, React.createElement(Draggable, {
    handle: `.${styles.handler}`,
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