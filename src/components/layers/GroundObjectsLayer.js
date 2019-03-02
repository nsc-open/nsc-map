import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import GroupLayer from './GroupLayer'
import FeatureLayer from './FeatureLayer'
import { GEOMETRY_TYPE } from '../../constants/geometry'

// is a combination of GraphicsLayer and Annotation Layer
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
  constructor (props) {
    super(props)
    this.state = {}

    this.featureLayers = {
      point: null,
      polyline: null,
      polygon: null
    }
  }

  layerLoadHandler = (layerType, layer) => {
    this.featureLayers[layerType] = layer

    const {
      point: pointFeatureLayer,
      polyline: polylineFeatureLayer,
      polygon: polygonFeatureLayer
    } = this.featureLayers
    
    if (pointFeatureLayer && polylineFeatureLayer && polygonFeatureLayer) {
      this.props.onLoad({ pointFeatureLayer, polylineFeatureLayer, polygonFeatureLayer })
    }
  }

  render () {
    console.log('GroundObjectsLayer render', this.props)
    const { children, map, view } = this.props
    if (!map) {
      return null
    }
    const points = []
    const multipoints = []
    const polylines = []
    const polygons = []

    // TODO 这里如果 children数量很大上万条数据，怎么可以快一些或者 cache 计算结果
    Children.map(children, child => {
      const { geometry } = child.props.geometryJson
      if (geometry.type === GEOMETRY_TYPE.POLYGON.key) {
        polygons.push(child)
      } else if (geometry.type === GEOMETRY_TYPE.POLYLINE.key) {
        polylines.push(child)
      } else if (geometry.type === GEOMETRY_TYPE.POINT.key) {
        points.push(child)
      } else if (geometry.type === GEOMETRY_TYPE.MULTIPOINT.key) {
        multipoints.push(child)
      }
    })

    return (
      <GroupLayer map={map} view={view}>
        <FeatureLayer
          key="polygonFeatureLayer"
          onLoad={layer => this.layerLoadHandler('polygon', layer)}
          featureLayerProperties={{
            source: [],
            geometryType: 'polygon',
            objectIdField: 'ObjectID',
            renderer: {
              type: "simple", // autocasts as new SimpleRenderer()
              symbol: {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: [227, 139, 79, 0.8],
                outline: { // autocasts as new SimpleLineSymbol()
                  color: [255, 255, 255],
                  width: 1
                }
              }
            }
          }}
        >
          {polygons}
        </FeatureLayer>
        <FeatureLayer
          key="polylineFeatureLayer"
          onLoad={layer => this.layerLoadHandler('polyline', layer)}
          featureLayerProperties={{
            source: [],
            geometryType: 'polyline',
            objectIdField: 'ObjectID',
            renderer: {
              type: "simple", // autocasts as new SimpleRenderer()
              symbol: {
                type: "simple-line",  // autocasts as new SimpleLineSymbol()
                color: "red",
                width: "2px",
                style: "short-dot"
              }
            }
          }}
        >
          {polylines}
        </FeatureLayer>
        <FeatureLayer
          key="pointFeatureLayer"
          onLoad={layer => this.layerLoadHandler('point', layer)}
          featureLayerProperties={{
            source: [],
            geometryType: 'point',
            objectIdField: 'ObjectID',
            renderer: {
              type: "simple", // autocasts as new SimpleRenderer()
              symbol: {
                type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                style: "square",
                color: "blue",
                size: "8px",  // pixels
                outline: {  // autocasts as new SimpleLineSymbol()
                  color: [ 255, 255, 0 ],
                  width: 3  // points
                }
              }
            }
          }}
        >
          {points}
        </FeatureLayer>
      </GroupLayer>
    )
  }
}

GroundObjectsLayer.propTypes = {
  map: PropTypes.object,
  featureLayerPropperties: PropTypes.array,
  onLoad: PropTypes.func
}

GroundObjectsLayer.defaultProps = {
  map: null,
  featureLayerPropperties: [{
    geometryType: 'polygon',
    fields: [],
    objectIdField: '',
    labelingInfo: [],
    renderer: {}
  }],
  onLoad: () => {}
}

export default GroundObjectsLayer