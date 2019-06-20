import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import Toolbar from 'nsc-map/components/tools/toolbar/Toolbar'
import SelectOptionsBar from 'nsc-map/components/tools/select/SelectOptions'
import GraphicsLayer from 'nsc-map/esri/components/layers/GraphicsLayer'
import Graphic from 'nsc-map/esri/components/graphic/Graphic'
import { polygon, polyline } from 'mock/geometry-jsons'

export default class extends Component {
  state = {
    map: null,
    view: null,
    graphicsLayer: null
  }
  graphicsLayer = null

  onLoad = (map, view) => {
    this.setState({ map, view })
    window.Y = this
  }

  render () {
    const { map, view, graphicsLayer } = this.state    
    const TOOLS = graphicsLayer ? [{
      key: 'select',
      icon: 'edit',
      label: '选择',
      optionsBar: 
      <SelectOptionsBar
        ref={c => window.x = c}
        view={view}
        map={view}
        sourceLayers={[graphicsLayer]}
        onSelectionChange={e => console.log(e)}
      />
    }] : []

    return (
      <Map onLoad={this.onLoad}>
        <Toolbar tools={TOOLS} />
        <GraphicsLayer onLoad={graphicsLayer => this.setState({ graphicsLayer })}>
          <Graphic graphicProperties={polygon} />
          <Graphic geometryJson={polyline} />
        </GraphicsLayer>
      </Map>
    )
  }
}
