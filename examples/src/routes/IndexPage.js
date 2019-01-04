import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import GraphicsLayer from 'nsc-map/components/esri/layers/GraphicsLayer'
import Graphic from 'nsc-map/components/esri/Graphic'

// Create a polygon geometry
const polygon = {
  type: "polygon", // autocasts as new Polygon()
  rings: [
  [-64.78, 32.3],
  [-66.07, 18.45],
  [-80.21, 25.78],
  [-64.78, 32.3]
  ]
};

// Create a symbol for rendering the graphic
const fillSymbol = {
  type: "simple-fill", // autocasts as new SimpleFillSymbol()
  color: [227, 139, 79, 0.8],
  outline: { // autocasts as new SimpleLineSymbol()
  color: [255, 255, 255],
  width: 1
  }
};


export default class extends Component {
  state = {
    n: 0
  }

  componentDidMount () {
    setInterval(() => {
      this.setState({ n: this.state.n + 1 })
    }, 2000)
  }

  render () {
    const { n } = this.state
    return (
      <Map>
        <GraphicsLayer>
        <Graphic
          selected={n%2 === 0}
          graphicProperties={{
            geometry: polygon,
            symbol: fillSymbol
          }}
        />
        </GraphicsLayer>
      </Map>
    )
  }
}
