import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import GraphicsLayer from 'nsc-map/components/esri/layers/GraphicsLayer'
import FeatureLayer from 'nsc-map/components/esri/layers/FeatureLayer'
import GroupLayer from 'nsc-map/components/esri/layers/GroupLayer'
import Graphic from 'nsc-map/components/esri/Graphic'
import Sketch from 'nsc-map/components/widgets/sketch/Sketch'
import GroundObjectsLayer from 'nsc-map/components/GroundObjectsLayer'
import GroundObject from 'nsc-map/components/GroundObject'
import { polyline, point, polygon1, polygon2 } from 'mock/geometry-jsons'
import { loadModules } from 'esri-module-loader' 
import MapWidget from 'nsc-map/components/base/MapWidget'
import BasemapDropdown from 'nsc-map/components/widgets/BasemapDropdown'


const json1 = {"geometry":{"x":1.3358120593844913E7,"y":5310771.453513213,"spatialReference":{"wkid":102100}},"attributes":{"guid":"0ea639e8-a371-4949-b77b-2acdf5ad7e6b","name":"未命名","remark":"无","type":"point","movable":true,"editble":true,"visible":true},"symbol":{"color":[250,173,20,64],"outline":{"color":[250,173,20,255],"style":"esriSLSSolid","type":"esriSLS","width":1},"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","size":10,"style":"esriSMSCircle"}}
const json2 = {"geometry":{"x":1.3358120593844913E7,"y":5310771.453513213,"spatialReference":{"wkid":102100}},"attributes":{"guid":"0ea639e8-a371-4949-b77b-2acdf5ad7e6b","name":"未命名","remark":"无","type":"point","movable":true,"editble":true,"visible":true},"symbol":{"color":[250,173,20,64],"outline":{"color":[250,173,250,255],"style":"esriSLSSolid","type":"esriSLS","width":1},"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","size":20,"style":"esriSMSCircle"}}

const onlineFeatureLayerProperties = {
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/weather_stations_010417/FeatureServer/0",
  renderer: {
    type: "simple",
    symbol: {
      type: "simple-marker",
      color: [255, 255, 255, 0.6],
      size: 4,
      outline: {
        color: [0, 0, 0, 0.4],
        width: 0.5
      }
    }
  }
}

export default class extends Component {
  state = {
    n: 0,
    selectedKeys: []
  }

  componentDidMount () {
    setInterval(() => {
      // this.setState({ n: this.state.n + 1 })
    }, 2000)
  }

  onLoad = (map, view) => {
    const TIANDITU_TOKEN = 'e2b08de0708e5136fff0fccaf21dd9bd'

    const LAYERS = [/*{
      key: 'google-map', 
      urlTemplate: 'http://mt{subDomain}.google.cn/vt/lyrs=s&x={col}&y={row}&z={level}&s=Gali',
      subDomains: '0123'.split(''),
      title: '谷歌卫星地图'
    }, */{
      key: 'tianditu-map', 
      urlTemplate: `http://t{subDomain}.tianditu.com/DataServer?tk=${TIANDITU_TOKEN}&T=vec_w&x={col}&y={row}&l={level}`,
      subDomains: '01234567'.split(''),
      title: '天地图电子地图'
    },{
      key: 'tianditu-annotation', 
      urlTemplate: `http://t{subDomain}.tianditu.com/DataServer?tk=${TIANDITU_TOKEN}&T=cia_w&x={col}&y={row}&l={level}`,
      subDomains: '01234567'.split(''),
      title: '天地图注记'
    }]

    window.map = map
    this.setState({ map: map })
  }

  render () {
    const { selectedKeys, n } = this.state
    return (
      <Map
        onLoad={this.onLoad}
        loaderOptions={{ url: 'https://js.arcgis.com/4.8' }}
      >
        {/*
        <GraphicsLayer
          selectedKeys={selectedKeys}
          onSelectionChange={selectedKeys => this.setState({ selectedKeys })}
        >
          
          <Graphic
            key="2"
            geometryJson={json1}
          />
          <Graphic
            key="3"
            geometryJson={json2}
          />
        </GraphicsLayer>
        <FeatureLayer />
       */}

       
      
      <GroundObjectsLayer>
         <GroundObject key="0" geometryJson={polygon1} />
         <GroundObject key="1" geometryJson={polygon2} />
         <GroundObject key="2" geometryJson={polyline} />
         <GroundObject key="3" geometryJson={point} />
       </GroundObjectsLayer>
       

       <Sketch />

       <MapWidget draggable defaultPosition={{ x: 200, y: 200 }}>
        {this.state.map && <BasemapDropdown map={this.state.map} />}
       </MapWidget>

      </Map>
    )
  }
}
