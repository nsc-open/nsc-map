import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import EsriModuleLoader from 'esri-module-loader';
import { addKey } from './utils';
/**
 * usage:
 *  <FeatureLayer featureLayerProperties={} selectedKeys onSelectionChange>
 *    <Graphic />
 *    <Graphic />
 *  </FeatureLayer>
 */

class FeatureLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layer: null // need to put layer as state, so once layer is created, render would run again

    };
    this.eventHandlers = [];
  }

  componentWillMount() {
    console.log('FeatureLayer willmount');
    EsriModuleLoader.loadModules(['FeatureLayer', 'esri/widgets/Sketch/SketchViewModel']).then(({
      FeatureLayer
    }) => {
      const {
        featureLayerProperties
      } = this.props;
      console.log('FeatureLayer new FeatureLayer()', featureLayerProperties);
      const layer = new FeatureLayer(featureLayerProperties);
      this.addLayer(layer); // this.bindEvents()

      this.setState({
        layer
      });
    });
  }

  componentWillUnmount() {
    this.unbindEvents();
    this.removeLayer(this.state.layer);
  }

  componentDidUpdate(prevProps) {}

  bindEvents() {
    const {
      view,
      allowPointerSelection
    } = this.props;

    if (allowPointerSelection) {
      this.eventHandlers.push(view.on('click', e => {
        const {
          view,
          onSelectionChange
        } = this.props;
        const {
          layer
        } = this.state;
        view.hitTest(e).then(({
          results
        }) => {
          const selectedGraphics = results.filter(r => r.graphic.layer === layer).map(r => r.graphic);
          console.log('selected f', selectedGraphics);
          this.props.view.whenLayerView(layer).then(layerView => {
            console.log('layerView', layerView);
            layerView.highlight(selectedGraphics);
          });
        });
      }));
    }
  }

  unbindEvents() {
    this.eventHandlers.forEach(h => h.remove());
  }

  addLayer(layer) {
    const {
      map,
      parentLayer
    } = this.props;

    if (parentLayer) {
      console.log('FeatureLayer parentLayer.add(layer)');
      parentLayer.add(layer);
    } else {
      console.log('FeatureLayer map.add(layer)');
      map.add(layer);
    }
  }

  removeLayer(layer) {
    const {
      map,
      parentLayer
    } = this.props;

    if (parentLayer) {
      parentLayer.remove(layer);
    } else {
      map.remove(layer);
    }
  }

  getGraphicKeys(graphics = []) {
    return graphics.map(g => g.attributes.key);
  }

  render() {
    const {
      children = []
    } = this.props;
    const {
      layer
    } = this.state;

    if (layer) {
      console.log('FeatureLayer render has layer');
      const childProps = {
        layer // pass graphicsLayer to direct children

      };
      return Children.map(children, child => {
        const graphicKey = child.key;
        addKey(child.props, graphicKey);
        return React.cloneElement(child, childProps);
      });
    } else {
      console.log('FeatureLayer render null');
      return null;
    }
  }

}

FeatureLayer.propTypes = {
  map: PropTypes.object,
  parentLayer: PropTypes.object,
  featureLayerPropperties: PropTypes.object,
  // isRequired
  allowPointerSelection: PropTypes.bool,
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  onSelectionChange: PropTypes.func
};
FeatureLayer.defaultProps = {
  map: undefined,
  parentLayer: undefined,
  featureLayerPropperties: undefined,
  allowPointerSelection: true,
  selectedKeys: [],
  onSelectionChange: null
};
export default FeatureLayer;