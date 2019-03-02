function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * MapWidget 在 MapPortal 和 MapDraggable 之上，提供基础的样式
 * 
 * MapWidget is a portal component, which means the actual mount position has no relationship with where this component is defined
 * So, there are two ways to define:
 * 
 * <Map>
 *  <MapWidget />
 * </Map>
 * 
 * <div>
 *  <Map />
 *  <MapWidget mapId="default" />
 * </div>
 * 
 * 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapPortal from './MapPortal';
import MapDraggble from './MapDraggable';
let zIndex = 50;
const MAP_PADDING = 15;
const styles = {
  widget: {
    position: 'absolute',
    display: 'inline-block',
    borderRadius: '2px',
    background: '#fafafa',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    padding: '6px 8px'
  }
};

class MapWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zIndex: ++zIndex
    };
  }

  render() {
    const {
      map,
      view,
      draggable,
      children,
      defaultPosition
    } = this.props;
    const {
      zIndex
    } = this.state;

    if (draggable) {
      return React.createElement(MapDraggble, {
        map: map,
        view: view,
        defaultPosition: defaultPosition,
        zIndex: zIndex
      }, children);
    } else {
      const style = _objectSpread({}, styles.widget, {
        zIndex
      });

      if (defaultPosition) {
        style.top = defaultPosition.y + 'px';
        style.left = defaultPosition.x + 'px';
      }

      return React.createElement(MapPortal, {
        map: map,
        view: view
      }, React.createElement("span", {
        style: style
      }, children));
    }
  }

}

MapWidget.propTypes = {
  map: PropTypes.object,
  view: PropTypes.object,
  draggable: PropTypes.bool,
  defaultPosition: PropTypes.object // { x, y }

};
MapWidget.defaultProps = {
  draggable: false
};
export default MapWidget;