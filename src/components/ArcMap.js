import React, { Component } from 'react'
import PropTypes from 'prop-types'
import EsriLoaderReact from 'esri-loader-react'
import MapDraggable from '@/components/MapDraggable'
import MapPortal from '@/components/MapPortal'
import MapToolbar from '@/components/MapToolbar'
import Loader from 'esri-module-loader'
import styles from './ArcMap.css'
import { Button } from 'antd'

import SelectionManager from '@/lib/graphic/selection-manager'

import { initAddGraphicsDemo } from '@/demos/add-graphics'


const tools = [
  { key: 'home', label: '导航', icon : 'home' },
  { key: 'select', label: '选择', icon : 'select', panelRender: () => <div>select</div> },
  { key: 'box-select', label: '框选', icon : 'border', panelRender: () => <div>box select</div> },
  { key: 'draw', label: '绘制', icon : 'highlight', panelRender: () => <div>绘制类型：<Button size="small">点</Button><Button size="small">线</Button><Button size="small">多边形</Button><Button size="small">圆</Button></div> },
  { key: 'measure', label: '测量', icon : 'gitlab', panelRender: () => <div>measure</div> },
]

class ArcMap extends Component {

  state = {
    mapReady: false,
    activeToolKey: ''
  }

  readyHandler = ({ loadedModules, containerNode }) => {
    const [ Map ] = loadedModules
    const map = new Map(containerNode, {
      center: [-118, 34.5],
      zoom: 8,
      basemap: "topo"
    })

    map.on('load', () => {
      initAddGraphicsDemo(map)

      window.SM = new SelectionManager({ map })

      this.setState({ mapReady: true })
    })

    this.map = window.map = map
    
  }

  errorHandler = (e) => {
    console.log(e)
  }

  renderToolSettingsPanel () {
    const { activeToolKey } = this.state
    const match = tools.find(t => t.key === activeToolKey)
    return match && match.panelRender
      ? <MapDraggable map={this.map}>
          {match.panelRender()}
        </MapDraggable>
      : null
  }
  renderOnMapComponents () {
    const { activeToolKey } = this.state
    return (
      <div>
        <MapToolbar map={this.map} tools={tools} onChange={key => this.setState({ activeToolKey: key })} activeToolKey={activeToolKey} />
        {this.renderToolSettingsPanel()}
      </div>
    )
  }

  render () {
    const { mapReady } = this.state
    return (
      <EsriLoaderReact
        options={{ url: '//js.arcgis.com/3.25/' }}
        modulesToLoad={['esri/map']}
        mapContainerClassName={styles.mapContainer}
        onReady={this.readyHandler}
        onError={this.errorHandler}
      >
        {mapReady ? this.renderOnMapComponents() : null}
      </EsriLoaderReact>
    )
  }
}

ArcMap.propTypes = {

}

export default ArcMap