function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import EsriModuleLoader from 'esri-module-loader';

class GroupLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layer: null
    };
  }

  componentWillMount() {
    console.log('GroupLayer willmount');
    EsriModuleLoader.loadModules(['esri/layers/GroupLayer']).then(({
      GroupLayer
    }) => {
      const {
        map
      } = this.props;
      console.log('map true?', !!map);
      const layer = new GroupLayer();
      map.add(layer);
      console.log('GroupLayer map.add(layer)');
      this.setState({
        layer
      });
    });
  }

  componentWillUnmount() {
    this.props.map.remove(this.state.layer);
  }

  render() {
    const {
      children,
      map,
      view
    } = this.props;
    const {
      layer
    } = this.state;

    if (layer && children) {
      console.log('GroupLayer render');
      return Children.map(children, child => {
        const childProps = _objectSpread({}, child.props, {
          map,
          view,
          parentLayer: layer
        });

        return React.cloneElement(child, childProps);
      });
    } else {
      console.log('GroupLayer render null', this.props);
      return null;
    }
  }

}

GroupLayer.propTypes = {
  map: PropTypes.object,
  view: PropTypes.object
};
GroupLayer.defaultTypes = {
  map: undefined,
  view: undefined
};
export default GroupLayer;