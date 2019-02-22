import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import MapWidget from 'nsc-map/components/base/MapWidget'
import BasemapDropdown from 'nsc-map/components/widgets/BasemapDropdown'
import LayerServiceSelector from 'nsc-map/components/layer-service/LayerServiceSelector'
import { layers, categories } from 'mock/layer-services'

export default class extends Component {
  state = {
    map: null,
    view: null
  }

  onLoad = (map, view) => {
    window.map = map
    this.setState({
      map,
      view
    })
  }

  render () {
    return (
      <Map
        onLoad={this.onLoad}
        loaderOptions={{ url: 'https://js.arcgis.com/4.8' }}
      >
       <MapWidget draggable defaultPosition={{ x: 200, y: 200 }}>
        {this.state.map && <BasemapDropdown map={this.state.map} />}
        {this.state.view && <LayerServiceSelector mapView={this.state.view} categories={categories} layers={layers} />}
       </MapWidget>
      </Map>
    )
  }
}
