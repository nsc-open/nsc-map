import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import Toolbar from 'nsc-map/components/tools/toolbar/Toolbar'
import MeasureOptionsBar from 'nsc-map/components/tools/measure/MeasureOptions'
import { loadModules } from 'esri-module-loader'

export default class extends Component {
  state = {
    map: null,
    view: null
  }

  onLoad = (map, view) => {

    loadModules([
      'esri/layers/FeatureLayer',
      'esri/layers/GraphicsLayer',
      'esri/Graphic',
      'esri/layers/support/LabelClass'
    ]).then(({ GraphicsLayer, FeatureLayer, Graphic, LabelClass }) => {
      this.setState({ map, view })
    })
    
  }

  render () {
    const { map, view } = this.state    
    const TOOLS = [{
      key: 'measure',
      icon: 'colum-height',
      label: '测量',
      optionsBar: map ? <MeasureOptionsBar view={view} /> : null
    }]

    return (
      <Map onLoad={this.onLoad}>
        <Toolbar tools={TOOLS} />
      </Map>
    )
  }
}
