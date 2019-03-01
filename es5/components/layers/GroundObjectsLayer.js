function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import GroupLayer from './GroupLayer';
import FeatureLayer from './FeatureLayer';
import { GEOMETRY_TYPE } from '../../constants/geometry';
import GraphicSelectionManager from '../../core/graphic-selection-manager/GraphicSelectionManager'; // is a combination of GraphicsLayer and Annotation Layer

/**
 * <GroundObjectsLayer>
 *  <GroundObject />
 *  <GroundObject />
 * </GroundObjectsLayer>
 * 
 * TODO:
 *   1. mapping from GroundObject.key to graphic instance
 */

class GroundObjectsLayer extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "layerLoadHandler", (layerType, layer) => {
      if (layerType === 'points') {
        this.pointsFeatureLayer = layer;
      } else if (layerType === 'lines') {
        this.linesFeatureLayer = layer;
      } else if (layerType === 'polygon') {
        this.polygonsFeatureLayer = layer;
      }

      this.selectionManager.addLayer(layer);
    });

    this.state = {};
    this.pointsFeatureLayer = null;
    this.linesFeatureLayer = null;
    this.polygonsFeatureLayer = null;
    this.selectionManager = null;
  }

  componentWillMount() {
    const {
      view,
      onSelectionChange
    } = this.props;
    const manager = new GraphicSelectionManager({
      view
    });
    manager.on('selectionChange', onSelectionChange);
    manager.activate({
      type: 'pointer'
    });
    this.selectionManager = manager;
  }

  componentWillUnmount() {
    this.selectionManager.destroy();
    this.selectionManager = null;
  }

  componentDidMount() {
    const {
      defaultSelectedKeys
    } = this.props;
  }

  componentDidUpdate(prevProps) {
    const {
      selectedKeys,
      selectionMode,
      allowMultipleSelection,
      children
    } = this.props;
    const {
      selectionManager
    } = this;

    if (prevProps.selectionMode !== selectionMode) {
      selectionManager.mode(selectionMode);
    }

    if (prevProps.allowMultipleSelection !== allowMultipleSelection) {
      allowMultipleSelection ? selectionManager.enableMultipleSelection() : selectionManager.disableMultipleSelection();
    }

    if (prevProps.selectedKeys !== selectedKeys) {
      // select graphics by key
      selectionManager.select(selectedKeys); // TODO: key => graphic instance
    }
  }

  render() {
    console.log('GroundObjectsLayer render', this.props);
    const {
      children,
      map,
      view
    } = this.props;

    if (!map) {
      return null;
    }

    const points = [];
    const multipoints = [];
    const polylines = [];
    const polygons = []; // TODO 这里如果 children数量很大上万条数据，怎么可以快一些或者 cache 计算结果

    Children.map(children, child => {
      const {
        geometry
      } = child.props.geometryJson;

      if (geometry.type === GEOMETRY_TYPE.POLYGON.key) {
        polygons.push(child);
      } else if (geometry.type === GEOMETRY_TYPE.POLYLINE.key) {
        polylines.push(child);
      } else if (geometry.type === GEOMETRY_TYPE.POINT.key) {
        points.push(child);
      } else if (geometry.type === GEOMETRY_TYPE.MULTIPOINT.key) {
        multipoints.push(child);
      }
    });
    console.log(points, polylines, polygons);
    return React.createElement(GroupLayer, {
      map: map,
      view: view
    }, React.createElement(FeatureLayer, {
      key: "polygonsFeatureLayer",
      onLoad: layer => this.layerLoadHandler('polygons', layer),
      featureLayerProperties: {
        source: [],
        geometryType: 'polygon',
        objectIdField: 'ObjectID',
        renderer: {
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
        }
      }
    }, polygons), React.createElement(FeatureLayer, {
      key: "linesFeatureLayer",
      onLoad: layer => this.layerLoadHandler('lines', layer),
      featureLayerProperties: {
        source: [],
        geometryType: 'polyline',
        objectIdField: 'ObjectID',
        renderer: {
          type: "simple",
          // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-line",
            // autocasts as new SimpleLineSymbol()
            color: "red",
            width: "2px",
            style: "short-dot"
          }
        }
      }
    }, polylines), React.createElement(FeatureLayer, {
      key: "pointsFeatureLayer",
      onLoad: layer => this.layerLoadHandler('points', layer),
      featureLayerProperties: {
        source: [],
        geometryType: 'point',
        objectIdField: 'ObjectID',
        renderer: {
          type: "simple",
          // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-marker",
            // autocasts as new SimpleMarkerSymbol()
            style: "square",
            color: "blue",
            size: "8px",
            // pixels
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: [255, 255, 0],
              width: 3 // points

            }
          }
        }
      }
    }, points));
  }

}

GroundObjectsLayer.propTypes = {
  map: PropTypes.object,
  selectionMode: PropTypes.string,
  allowMultipleSelection: PropTypes.bool,
  defaultSelectedKeys: PropTypes.array,
  selectedKeys: PropTypes.array,
  // keys of selected ground objects
  onSelectionChange: PropTypes.func // ({ selectedKeys, addedKeys, removedKeys }) => {}

};
GroundObjectsLayer.defaultProps = {
  map: null,
  featureLayerPropperties: [{
    geometryType: 'polygon',
    fields: [],
    objectIdField: '',
    labelingInfo: [],
    renderer: {}
  }],
  selectionMode: 'pointer',
  allowMultipleSelection: false,
  defaultSelectedKeys: [],
  selectedKeys: [],
  onSelectionChange: e => console.log('selectionChange', e)
};
export default GroundObjectsLayer;