import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import MapWidget from 'nsc-map/components/base/MapWidget'
import Toolbar from 'nsc-map/components/tools/toolbar/Toolbar'
import DrawOptionsBar from 'nsc-map/components/tools/draw/DrawOptions'
import ExportOptionsBar from 'nsc-map/components/tools/export/ExportOptions'
import MeasureOptionsBar from 'nsc-map/components/tools/measure/MeasureOptions'




export default class extends Component {
  state = {}

  render () {
    const { view } = this.state
    const TOOLS = view ? [
      { key: 'select', icon: 'pushpin', label: '选择' },
      { key: 'measure', icon: 'stock', label: '测量', optionsBar: <MeasureOptionsBar view={view} /> },
      // { key: 'draw', icon: 'edit', label: '绘制', optionsBar: <DrawOptionsBar /> },
      { key: 'import', icon: 'upload', label: '导入' },
      { key: 'export', icon: 'download', label: '导出', optionsBar: <ExportOptionsBar /> },
    ] : []

    return (
      <Map
        onLoad={(map, view)=> {
          this.setState({ view })
          window.view = view
        }}
      >
        <MapWidget defaultPosition={{ x: 300, y: 300 }}>This is a fixed widget 300, 300</MapWidget>

        <MapWidget draggable defaultPosition={{ x: 200, y: 200 }}>This is a draggable widget</MapWidget>

        <Toolbar tools={TOOLS} />
      </Map>
    )
  }
}
