import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import GraphicsLayer from 'nsc-map/components/layers/GraphicsLayer'
import Graphic from 'nsc-map/components/graphic/Graphic'
import { polyline, polygon } from 'mock/geometry-jsons'

const json1 = {"geometry":{"x":1.3358120593844913E7,"y":5310771.453513213,"spatialReference":{"wkid":102100}},"attributes":{"guid":"0ea639e8-a371-4949-b77b-2acdf5ad7e6b","name":"未命名","remark":"无","type":"point","movable":true,"editble":true,"visible":true},"symbol":{"color":[250,173,20,64],"outline":{"color":[250,173,20,255],"style":"esriSLSSolid","type":"esriSLS","width":1},"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","size":10,"style":"esriSMSCircle"}}
const lineGeometry = {"spatialReference":{"wkid":102100},"paths":[[[-12389859.325291349,6924024.550392056],[-12406252.859677356,5146922.227979409],[-10477868.799400078,5144913.107431645],[-10457352.965120118,3489418.191019431]]]}
const geometryJsons = [json1, polyline].map((p, i) => {
  p.attributes.key = i + ''
  return p
})

window.changeGeometry = () => {
  const graphicsLayer = window.graphicsLayer
  const { graphics } = graphicsLayer.state
  const key = '1'
  const match = graphics.find(g => g.attributes.key === key)
  graphicsLayer.setState({
    graphics: [
      ...graphics.filter(g => g.attributes.key !== key),
      {
        ...match,
        geometry: lineGeometry
      }
    ]
  })
}

export default class extends Component {
  
  state = {
    map: null,
    graphics: geometryJsons,
    selectable: true,
    selectedKeys: [],
    editingKeys: []
  }

  onLoad = (map, view) => {
    this.setState({ map: map }) 
  }

  onSelect = (selectedKeys, details) => {
    console.log('=> onSelect', selectedKeys, details)
    this.setState({ selectedKeys })
  }

  onEdit = ({ graphic, e, key }) => {
    const { graphics } = this.state
    const match = graphics.find(g => g.attributes.key === key)
    this.setState({
      graphics: [
        ...graphics.filter(g => g.attributes.key !== key),
        {
          ...match,
          geometry: graphic.toJSON().geometry
        }
      ]
    })
  }

  componentDidMount () {
    window.graphicsLayer = this
    return
    let i = 0
    setInterval(() => {
      console.log('---------------------')
      const { graphics } = this.state
      const updatedGraphic = graphics[0]
      updatedGraphic.geometry.x += 10000
      this.setState({
        graphics: [JSON.parse(JSON.stringify(updatedGraphic)), graphics[1]],
        selectedKeys: i % 2 === 0 ? ['0'] : ['1']
      })
      i++
    }, 2000)
  }

  render () {
    const { map, graphics, selectedKeys, editingKeys, selectable } = this.state
    return (
      <Map onLoad={this.onLoad}>
      {map ?
      <GraphicsLayer
        selectable={selectable}
        selectedKeys={selectedKeys}
        onSelect={this.onSelect}
        
        editingKeys={editingKeys}
        onEdit={this.onEdit}
      >
        {graphics.map((g, i) => <Graphic key={i} json={g} />)}
      </GraphicsLayer>
      : null}
        
      </Map>
    )
  }
}