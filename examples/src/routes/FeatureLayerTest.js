import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import FeatureLayer from 'nsc-map/esri/components/layers/FeatureLayer'
import Graphic from 'nsc-map/esri/components/graphic/Graphic'
import { polygon1, polygon2 } from 'mock/geometry-jsons'

const geometryJsons = [polygon1, polygon2].map((p, i) => {
  p.attributes.key = i + ''
  return p
})

export default class extends Component {

  state = {
    graphics: geometryJsons,
    selectedKeys: [],
    editingKeys: []
  }

  updateGeometry () {
    const { graphics } = this.state
    const key = '1'
    const match = graphics.find(g => g.attributes.key === key)
    this.setState({
      graphics: [
        ...graphics.filter(g => g.attributes.key !== key),
        {
          ...match,
          geometry: {"type":"polygon","spatialReference":{"wkid":102100},"rings":[[[-7211276.613588262,3802755.0318591143],[-7354878.7567115845,2090288.1170993866],[-8928936.356528472,2971858.417348545],[-8559303.466083396,4160237.9546233397],[-7211276.613588262,3802755.0318591143]]]}
        }
      ]
    })
  }
  
  onLoad = (map, view) => {
    this.setState({ map, view }, () => {
      window.map = map
      window.view = view
      // setTimeout(() => this.updateGeometry(), 2000)
    })
  }

  onSelect = (selectedKeys, details) => {
    console.log('=> onSelect', selectedKeys, details)
    this.setState({ editingKeys: selectedKeys })
  }

  onEdit = ({ graphic, e, key }) => {
    console.log('=> onEdit', graphic, key)
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

  render () {
    window.featureLayer = this
    const { graphics, selectedKeys, editingKeys } = this.state
    console.log('FeatureLayerTest.render', this)
    return (
      <Map
        onLoad={this.onLoad}
      >
        <FeatureLayer properties={{
            source: [],
            geometryType: 'polygon',
            objectIdField: 'ObjectID',
            displayField: 'ObjectID',
            fields: [{
              name: 'ObjectID',
              type: 'string'
            }, {
              name: 'key',
              type: 'string'
            }],
            // spatialReference: { wkid:102100 },
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
          onLoad={l => this.featureLayer = l}
          selectable={true}
          selectedKeys={selectedKeys}
          onSelect={this.onSelect}
          
          editingKeys={editingKeys}
          onEdit={this.onEdit}
        >
          {graphics.map((g, i) => <Graphic key={i} json={g} />)}
        </FeatureLayer>
      </Map>
    )
  }
}
