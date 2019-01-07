import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import EsriModuleLoader from 'esri-module-loader';
import { addKey } from './utils';
var features = [{
  geometry: {
    type: "polygon",
    // autocasts as new Polygon()
    rings: [[-64.78, 32.3], [-66.07, 18.45], [-80.21, 25.78], [-64.78, 32.3]]
  },
  attributes: {
    ObjectID: 1,
    DepArpt: "KATL",
    MsgTime: Date.now(),
    FltId: "UAL1"
  }
}];
const renderer = {
  type: "simple",
  // autocasts as new SimpleRenderer()
  symbol: {
    type: "simple-fill",
    // autocasts as new SimpleFillSymbol()
    color: [227, 139, 79, 0.8],
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: [255, 255, 255],
      width: 1
    }
  }
  /**
   * usage:
   *  <FeatureLayer featureLayerProperties={} selectedKeys onSelectionChange>
   *    <Graphic />
   *    <Graphic />
   *  </FeatureLayer>
   */

};

class FeatureLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layer: null // need to put layer as state, so once layer is created, render would run again

    };
    this.eventHandlers = [];
  }

  componentWillMount() {
    EsriModuleLoader.loadModules(['FeatureLayer', 'esri/widgets/Sketch/SketchViewModel']).then(({
      FeatureLayer,
      SketchViewModel
    }) => {
      const layer = new FeatureLayer({
        // source: features,
        // geometryType: 'polygon',
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/weather_stations_010417/FeatureServer/0",
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-marker",
            color: [255, 255, 255, 0.6],
            size: 4,
            outline: {
              color: [0, 0, 0, 0.4],
              width: 0.5
            }
          }
        }
      });
      this.addLayer(layer);
      this.bindEvents();
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
    console.log('FeatureLayer addLayer');
    const {
      map,
      parentLayer
    } = this.props;

    if (parentLayer) {
      parentLayer.add(layer);
    } else {
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
    console.log('FeatureLayer render');
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
      return null;
    }
  }

}

FeatureLayer.propTypes = {
  map: PropTypes.object.isRequired,
  parentLayer: PropTypes.object,
  allowPointerSelection: PropTypes.bool,
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  onSelectionChange: PropTypes.func
};
FeatureLayer.defaultProps = {
  map: undefined,
  parentLayer: undefined,
  allowPointerSelection: true,
  selectedKeys: [],
  onSelectionChange: null
};
export default FeatureLayer;