import React, { Component } from 'react'
import PropTypes from 'prop-types'
import EsriModuleLoader from 'esri-module-loader'
import GroupLayer from './esri/layers/GroupLayer'
import FeatureLayer from './esri/layers/FeatureLayer'

const onlineFeatureLayerProperties = {
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
}

// is a combination of GraphicsLayer and Annotation Layer
/**
 * <GroundObjectsLayer>
 *  <GroundObject />
 *  <GroundObject />
 * </GroundObjectsLayer>
 */
class GroundObjectsLayer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      groupLayer: null,
      pointsFeatureLayer: null,
      linesFeatureLayer: null,
      polygonsFeatureLayer: null
    }
  }

  add () {

  }

  remove () {

  }

  update () {

  }

  render () {
    console.log('GroundObjectsLayer render', this.props)
    const { children, map } = this.props
    if (!map) {
      return null
    }

    return (
      <GroupLayer map={map}>
        {/*
        <FeatureLayer key="polygonsFeatureLayer"></FeatureLayer>
        <FeatureLayer key="linesFeatureLayer"></FeatureLayer>
        */}
        <FeatureLayer
          key="polygonsFeatureLayer"
          featureLayerProperties={{
            source: [],
            geometryType: 'polygon',
            objectIdField: 'ObjectID',
            // fields: [{ name: 'ObjectID', alias: 'ObjectID', type: 'string' }],
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
          {children}
        </FeatureLayer>
        <FeatureLayer key="pointsFeatureLayer" featureLayerProperties={onlineFeatureLayerProperties}></FeatureLayer>
      </GroupLayer>
    )
  }
}

GroundObjectsLayer.propTypes = {
  map: PropTypes.object,
}

GroundObjectsLayer.defaultProps = {
  map: null
}

export default GroundObjectsLayer