import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import FeatureLayer from 'nsc-map/components/layers/FeatureLayer'
import Graphic from 'nsc-map/components/esri/Graphic'
import { polygon1, polygon2 } from 'mock/geometry-jsons'

export default class extends Component {

  state = {
    graphics: [polygon1]
  }

  componentDidMount () {
    window.add = () =>  this.addGraphic()
  }

  addGraphic () {
    this.setState({
      graphics: [...this.state.graphics, polygon2]
    })
  }
  
  onLoad = (map, view) => {
    this.setState({ map: map })
  }

  render () {
    const { graphics } = this.state
    return (
      <Map
        onLoad={this.onLoad}
      >
        <FeatureLayer featureLayerProperties={{
            source: [],
            geometryType: 'polygon',
            objectIdField: 'ObjectID',
            displayField: 'ObjectID',
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
          {graphics.map((g, i) => <Graphic
            key={i}
            geometryJson={g}
          />)}
        </FeatureLayer>
      </Map>
    )
  }
}
