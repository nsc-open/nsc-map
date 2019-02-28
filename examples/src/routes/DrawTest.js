import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import Toolbar from 'nsc-map/components/tools/toolbar/Toolbar'
import DrawOptionsBar from 'nsc-map/components/tools/draw/DrawOptions'
import Sketch from 'nsc-map/core/Sketch'
import { loadModules } from 'esri-module-loader'

const TOOLS = [
  { key: 'draw', icon: 'edit', label: '绘制', optionsBar: <DrawOptionsBar /> }
]
const testPolygonGraphicJson = JSON.parse('{"geometry":{"spatialReference":{"latestWkid":3857,"wkid":102100},"rings":[[[-13412744.469982473,6081291.325808455],[-13174260.941732787,6080068.333355892],[-13209727.722857099,5998127.839034205],[-13272100.337937785,5814678.971149831],[-13544827.654859222,5885612.533398456],[-13412744.469982473,6081291.325808455]]]},"symbol":{"type":"esriSFS","color":[0,0,0,51],"outline":{"type":"esriSLS","color":[255,0,0,255],"width":2,"style":"esriSLSSolid"},"style":"esriSFSSolid"},"attributes":{}}')

export default class extends Component {
  state = {
    map: null,
    view: null
  }

  onLoad = (map, view) => {
    this.setState({ map, view })

    loadModules([
      'esri/layers/FeatureLayer',
      'esri/layers/GraphicsLayer',
      'esri/Graphic'
    ]).then(({ GraphicsLayer, FeatureLayer, Graphic }) => {
      const graphicsLayer = new GraphicsLayer()
      const featureLayer = new FeatureLayer({
        source: [],
        geometryType: 'polygon',
        objectIdField: 'ObjectID',
        displayField: 'ObjectID',
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
      })
      map.add(featureLayer)
      map.add(graphicsLayer)

      testPolygonGraphicJson.attributes.ObjectID = '001'
      const g = Graphic.fromJSON(testPolygonGraphicJson)

      // graphicsLayer.add(g)
      // g.layer = graphicsLayer

      featureLayer.applyEdits({ addFeatures: [g] })
      g.layer = featureLayer

    
      const sketch = window.sketch = new Sketch({
        view,
        updateOnGraphicClick: false,
      })

      console.log('graphic => ', g)
      sketch.create(featureLayer, 'polygon')
      // sketch.update(featureLayer, g)
    })
    
  }

  render () {
    return (
      <Map onLoad={this.onLoad}>
        <Toolbar tools={TOOLS} />
      </Map>
    )
  }
}
