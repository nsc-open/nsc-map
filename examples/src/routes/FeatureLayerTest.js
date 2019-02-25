import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import FeatureLayer from 'nsc-map/components/layers/FeatureLayer'
import Graphic from 'nsc-map/components/esri/Graphic'
import { polygon1, polygon2 } from 'mock/geometry-jsons'

export default class extends Component {
  
  onLoad = (map, view) => {
    this.setState({ map: map })
  }

  render () {
    return (
      <Map
        onLoad={this.onLoad}
        loaderOptions={{ url: 'https://js.arcgis.com/4.8' }}
      >
        <FeatureLayer featureLayerProperties={{
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
          }}>
          <Graphic
            key="2"
            geometryJson={polygon1}
          />
          <Graphic
            key="3"
            geometryJson={polygon2}
          />
        </FeatureLayer>
      </Map>
    )
  }
}
