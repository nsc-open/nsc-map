import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import MapWidget from 'nsc-map/components/base/MapWidget'
import Toolbar from 'nsc-map/components/tools/toolbar/Toolbar'
import DrawOptionsBar from 'nsc-map/components/tools/draw/DrawOptions'
import ExportOptionsBar from 'nsc-map/components/tools/export/ExportOptions'
import MeasureOptionsBar from 'nsc-map/components/tools/measure/MeasureOptions'
import { createNamespace } from 'nsc-map/utils/InstanceManager'

const viewInstanceNamespace = createNamespace('view')

const TOOLS = [
  { key: 'select', icon: 'pushpin', label: '选择' },
  { key: 'measure', icon: 'stock', label: '测量', optionsBar: <MeasureOptionsBar /> },
  { key: 'draw', icon: 'edit', label: '绘制', optionsBar: <DrawOptionsBar /> },
  { key: 'import', icon: 'upload', label: '导入' },
  { key: 'export', icon: 'download', label: '导出', optionsBar: <ExportOptionsBar /> },
]

export default class extends Component {
  componentWillMount () {
    viewInstanceNamespace.register('default')
  }

  render () {
    return (
      <Map
        onLoad={(map, view)=> {
          console.log('Map.onLoad()', map, view)
          window.map = map
          window.view = view
          viewInstanceNamespace.set('default', view)
          window.viewInstanceNamespace = viewInstanceNamespace
        }}
      >
        <MapWidget defaultPosition={{ x: 300, y: 300 }}>This is a fixed widget 300, 300</MapWidget>

        <MapWidget draggable defaultPosition={{ x: 200, y: 200 }}>This is a draggable widget</MapWidget>

        <Toolbar tools={TOOLS} />
      </Map>
    )
  }
}