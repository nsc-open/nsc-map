import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import GroundObjectsLayer from 'nsc-map/components/layers/GroundObjectsLayer'
import GroundObject from 'nsc-map/components/GroundObject'
import { polyline, point, polygon1, polygon2 } from 'mock/geometry-jsons'

export default class extends Component {

  onLoad = (map, view) => {
    window.map = map
    this.setState({ map: map })
  }

  render () {
    return (
      <Map
        onLoad={this.onLoad}
        loaderOptions={{ url: 'https://js.arcgis.com/4.8' }}
      >
        <GroundObjectsLayer>
         <GroundObject key="0" geometryJson={polygon1} />
         <GroundObject key="1" geometryJson={polygon2} />
         <GroundObject key="2" geometryJson={polyline} />
         <GroundObject key="3" geometryJson={point} />
        </GroundObjectsLayer>
      </Map>
    )
  }
}
