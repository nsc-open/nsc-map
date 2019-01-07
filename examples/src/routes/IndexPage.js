import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import GraphicsLayer from 'nsc-map/components/esri/layers/GraphicsLayer'
import FeatureLayer from 'nsc-map/components/esri/layers/FeatureLayer'
import GroundObjectsLayer from 'nsc-map/components/GroundObjectsLayer'
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

const graphicProperties = {
  geometry: polygon,
  symbol: fillSymbol,
  attributes: null
}

const json1 = {"geometry":{"x":1.3358120593844913E7,"y":5310771.453513213,"spatialReference":{"wkid":102100}},"attributes":{"guid":"0ea639e8-a371-4949-b77b-2acdf5ad7e6b","name":"未命名","remark":"无","type":"point","movable":true,"editble":true,"visible":true},"symbol":{"color":[250,173,20,64],"outline":{"color":[250,173,20,255],"style":"esriSLSSolid","type":"esriSLS","width":1},"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","size":10,"style":"esriSMSCircle"}}
const json2 = {"geometry":{"x":1.3358120593844913E7,"y":5310771.453513213,"spatialReference":{"wkid":102100}},"attributes":{"guid":"0ea639e8-a371-4949-b77b-2acdf5ad7e6b","name":"未命名","remark":"无","type":"point","movable":true,"editble":true,"visible":true},"symbol":{"color":[250,173,20,64],"outline":{"color":[250,173,250,255],"style":"esriSLSSolid","type":"esriSLS","width":1},"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","size":20,"style":"esriSMSCircle"}}


export default class extends Component {
  state = {
    n: 0,
    selectedKeys: []
  }

  componentDidMount () {
    setInterval(() => {
      // this.setState({ n: this.state.n + 1 })
    }, 2000)
  }

  render () {
    const { selectedKeys, n } = this.state
    return (
      <Map>
        {/*
        <GraphicsLayer
          selectedKeys={selectedKeys}
          onSelectionChange={selectedKeys => this.setState({ selectedKeys })}
        >
          
          <Graphic
            key="2"
            geometryJson={json1}
          />
          <Graphic
            key="3"
            geometryJson={json2}
          />
        </GraphicsLayer>
        <FeatureLayer />
       */}

        <GroundObjectsLayer />
      </Map>
    )
  }
}
