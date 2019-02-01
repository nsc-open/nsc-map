import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import MapWidget from 'nsc-map/components/base/MapWidget'
import Toolbar from 'nsc-map/components/tools/toolbar/Toolbar'
import DrawOptionsBar from 'nsc-map/components/tools/draw/DrawOptions'
import ExportOptionsBar from 'nsc-map/components/tools/export/ExportOptions'

const TOOLS = [
  { key: 'select', icon: 'pushpin', label: '选择' },
  { key: 'measure', icon: 'stock', label: '测量' },
  { key: 'draw', icon: 'edit', label: '绘制', optionsBar: <DrawOptionsBar /> },
  { key: 'import', icon: 'upload', label: '导入' },
  { key: 'export', icon: 'download', label: '导出', optionsBar: <ExportOptionsBar /> },
]

export default class extends Component {
  render () {
    return (
      <Map
        onLoad={(map, view)=> console.log('Map.onLoad()', map, view)}
      >
        <MapWidget defaultPosition={{ x: 300, y: 300 }}>This is a widget 300, 300</MapWidget>

        <MapWidget draggable defaultPosition={{ x: 200, y: 200 }}>This is a draggable widget</MapWidget>

        <Toolbar tools={TOOLS} />
      </Map>
    )
  }
}
