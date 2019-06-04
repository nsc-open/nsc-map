import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import GraphicsLayer from 'nsc-map/components/layers/GraphicsLayer'
import Graphic from 'nsc-map/components/graphic/Graphic'
import { polyline, polygon } from 'mock/geometry-jsons'

const json1 = {"geometry":{"x":1.3358120593844913E7,"y":5310771.453513213,"spatialReference":{"wkid":102100}},"attributes":{"guid":"0ea639e8-a371-4949-b77b-2acdf5ad7e6b","name":"未命名","remark":"无","type":"point","movable":true,"editble":true,"visible":true},"symbol":{"color":[250,173,20,64],"outline":{"color":[250,173,20,255],"style":"esriSLSSolid","type":"esriSLS","width":1},"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","size":10,"style":"esriSMSCircle"}}

const geometryJsons = [polyline, json1].map((p, i) => {
  p.attributes.key = i + ''
  return p
})

export default class extends Component {
  
  state = {
    map: null,
    graphics: geometryJsons,
    selectedKeys: ['1']
  }

  onLoad = (map, view) => {
    this.setState({ map: map }) 
  }

  componentDidMount () {
    let i = 0
    setInterval(() => {
      const { graphics } = this.state
      const updatedGraphic = graphics[1]
      updatedGraphic.geometry.x += 10000
      this.setState({
        graphics: [graphics[0], JSON.parse(JSON.stringify(updatedGraphic))],
        selectedKeys: i % 2 === 0 ? ['0'] : ['1']
      })
      i++
    }, 5000)
  }

  render () {
    const { map, graphics, selectedKeys } = this.state
    return (
      <Map onLoad={this.onLoad}>
      {map ?
      <GraphicsLayer
        selectedKeys={selectedKeys}
        editingKeys={['0']}
      >
        {graphics.map((g, i) => <Graphic key={i} json={g} />)}
      </GraphicsLayer>
      : null}
        
      </Map>
    )
  }
}