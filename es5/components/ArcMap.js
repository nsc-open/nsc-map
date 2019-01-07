function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EsriLoaderReact from 'esri-loader-react';
import MapDraggable from '@/components/MapDraggable';
import MapPortal from '@/components/MapPortal';
import MapToolbar from '@/components/MapToolbar';
import Loader from 'esri-module-loader';
import styles from './ArcMap.css';
import { Button } from 'antd';
import SelectionManager from '@/lib/graphic/selection-manager';
import { initAddGraphicsDemo } from '@/demos/add-graphics';
const tools = [{
  key: 'home',
  label: '导航',
  icon: 'home'
}, {
  key: 'select',
  label: '选择',
  icon: 'select',
  panelRender: () => React.createElement("div", null, "select")
}, {
  key: 'box-select',
  label: '框选',
  icon: 'border',
  panelRender: () => React.createElement("div", null, "box select")
}, {
  key: 'draw',
  label: '绘制',
  icon: 'highlight',
  panelRender: () => React.createElement("div", null, "\u7ED8\u5236\u7C7B\u578B\uFF1A", React.createElement(Button, {
    size: "small"
  }, "\u70B9"), React.createElement(Button, {
    size: "small"
  }, "\u7EBF"), React.createElement(Button, {
    size: "small"
  }, "\u591A\u8FB9\u5F62"), React.createElement(Button, {
    size: "small"
  }, "\u5706"))
}, {
  key: 'measure',
  label: '测量',
  icon: 'gitlab',
  panelRender: () => React.createElement("div", null, "measure")
}];

class ArcMap extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      mapReady: false,
      activeToolKey: ''
    });

    _defineProperty(this, "readyHandler", ({
      loadedModules,
      containerNode
    }) => {
      const [Map] = loadedModules;
      const map = new Map(containerNode, {
        center: [-118, 34.5],
        zoom: 8,
        basemap: "topo"
      });
      map.on('load', () => {
        initAddGraphicsDemo(map);
        window.SM = new SelectionManager({
          map
        });
        this.setState({
          mapReady: true
        });
      });
      this.map = window.map = map;
    });

    _defineProperty(this, "errorHandler", e => {
      console.log(e);
    });
  }

  renderToolSettingsPanel() {
    const {
      activeToolKey
    } = this.state;
    const match = tools.find(t => t.key === activeToolKey);
    return match && match.panelRender ? React.createElement(MapDraggable, {
      map: this.map
    }, match.panelRender()) : null;
  }

  renderOnMapComponents() {
    const {
      activeToolKey
    } = this.state;
    return React.createElement("div", null, React.createElement(MapToolbar, {
      map: this.map,
      tools: tools,
      onChange: key => this.setState({
        activeToolKey: key
      }),
      activeToolKey: activeToolKey
    }), this.renderToolSettingsPanel());
  }

  render() {
    const {
      mapReady
    } = this.state;
    return React.createElement(EsriLoaderReact, {
      options: {
        url: '//js.arcgis.com/3.25/'
      },
      modulesToLoad: ['esri/map'],
      mapContainerClassName: styles.mapContainer,
      onReady: this.readyHandler,
      onError: this.errorHandler
    }, mapReady ? this.renderOnMapComponents() : null);
  }

}

ArcMap.propTypes = {};
export default ArcMap;