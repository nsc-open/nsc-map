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

const json1 = {"geometry":{"x":1.3358120593844913E7,"y":5310771.453513213,"spatialReference":{"wkid":102100}},"attributes":{"guid":"0ea639e8-a371-4949-b77b-2acdf5ad7e6b","name":"未命名","remark":"无","type":"point","movable":true,"editble":true,"visible":true},"symbol":{"color":[250,173,20,64],"outline":{"color":[250,173,20,255],"style":"esriSLSSolid","type":"esriSLS","width":1},"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","size":10,"style":"esriSMSCircle"}}
const json2 = {"geometry":{"x":1.3358120593844913E7,"y":5310771.453513213,"spatialReference":{"wkid":102100}},"attributes":{"guid":"0ea639e8-a371-4949-b77b-2acdf5ad7e6b","name":"未命名","remark":"无","type":"point","movable":true,"editble":true,"visible":true},"symbol":{"color":[250,173,20,64],"outline":{"color":[250,173,250,255],"style":"esriSLSSolid","type":"esriSLS","width":1},"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","size":20,"style":"esriSMSCircle"}}


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
          geometryJson={n%2 === 0 ? json1 : json2}
        />
        </GraphicsLayer>
      </Map>
    )
  }
}
