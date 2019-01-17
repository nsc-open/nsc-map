import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import EsriModuleLoader from 'esri-module-loader';
import GroupLayer from './esri/layers/GroupLayer';
import FeatureLayer from './esri/layers/FeatureLayer';
import { GEOMETRY_TYPE } from '../constants/geometry'; // is a combination of GraphicsLayer and Annotation Layer

/**
 * <GroundObjectsLayer>
 *  <GroundObject />
 *  <GroundObject />
 * </GroundObjectsLayer>
 */

class GroundObjectsLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupLayer: null,
      pointsFeatureLayer: null,
      linesFeatureLayer: null,
      polygonsFeatureLayer: null
    };
  }

  add() {}

  remove() {}

  update() {}

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
      } = child.props.graphicProperties;

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
    return React.createElement(GroupLayer, {
      map: map,
      view: view
    }, React.createElement(FeatureLayer, {
      key: "polygonsFeatureLayer",
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
  map: PropTypes.object
};
GroundObjectsLayer.defaultProps = {
  map: null,
  featureLayerPropperties: [{
    geometryType: 'polygon',
    fields: [],
    objectIdField: '',
    labelingInfo: [],
    renderer: {}
  }]
};
export default GroundObjectsLayer;