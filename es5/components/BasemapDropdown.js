function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button, Icon, Menu } from 'antd';
import BasemapManager from '../core/BasemapManager';
const TIANDITU_TOKEN = 'e2b08de0708e5136fff0fccaf21dd9bd';
const LAYERS = {
  GOOGLE_MAP: {
    urlTemplate: 'http://mt{subDomain}.google.cn/vt/lyrs=s&x={col}&y={row}&z={level}&s=Gali',
    subDomains: '0123'.split('')
  },
  TIANDITU_MAP: {
    urlTemplate: `http://t{subDomain}.tianditu.com/DataServer?tk=${TIANDITU_TOKEN}&T=vec_w&x={col}&y={row}&l={level}`,
    subDomains: '01234567'.split('')
  },
  TIANDITU_ANNOTATION: {
    urlTemplate: `http://t{subDomain}.tianditu.com/DataServer?tk=${TIANDITU_TOKEN}&T=cia_w&x={col}&y={row}&l={level}`,
    subDomains: '01234567'.split('')
  }
};
const BASEMAPS = [{
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

class BaseMapSelector extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleMenuClick", ({
      key
    }) => {
      const {
        showAnnotation
      } = this.state;

      if (key === 'annotation') {
        this.setState({
          showAnnotation: !showAnnotation
        });
      } else {
        this.setState({
          currentBasemapId: key
        });
      }
    });

    this.state = {
      currentBasemapId: '',
      showAnnotation: false
    };
  }

  componentDidMount() {
    this.setState({
      currentBasemapId: BASEMAPS[0].id,
      showAnnotation: false
    });
    this.basemapManager = new BasemapManager({
      map: this.props.map,
      basemaps: BASEMAPS
    });
  }

  componentDidUpdate() {
    const {
      currentBasemapId,
      showAnnotation
    } = this.state;

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

  render() {
    const {
      currentBasemapId,
      showAnnotation
    } = this.state;
    const currentBasemap = BASEMAPS.find(b => b.id === currentBasemapId);
    const menu = React.createElement(Menu, {
      onClick: this.handleMenuClick
    }, BASEMAPS.map(basemap => React.createElement(Menu.Item, {
      key: basemap.id
    }, basemap.label, " ", currentBasemapId === basemap.id && React.createElement(Icon, {
      type: "check"
    }))), React.createElement(Menu.Divider, null), React.createElement(Menu.Item, {
      key: "annotation"
    }, "\u663E\u793A\u6CE8\u8BB0 ", showAnnotation && React.createElement(Icon, {
      type: "check"
    })));
    return React.createElement(Dropdown, {
      overlay: menu
    }, React.createElement(Button, null, currentBasemap && currentBasemap.label, " ", React.createElement(Icon, {
      type: "down"
    })));
  }

}

BaseMapSelector.propTypes = {
  map: PropTypes.object
};
export default BaseMapSelector;