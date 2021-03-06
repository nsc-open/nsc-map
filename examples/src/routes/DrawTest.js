import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import Toolbar from 'nsc-map/components/tools/toolbar/Toolbar'
import DrawOptionsBar from 'nsc-map/components/tools/draw/DrawOptions'
import Sketch from 'nsc-map/core/Sketch'
import { loadModules } from 'esri-module-loader'


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
      'esri/Graphic',
      'esri/layers/support/LabelClass'
    ]).then(({ GraphicsLayer, FeatureLayer, Graphic, LabelClass }) => {
      const graphicsLayer = new GraphicsLayer()
      const featureLayer = new FeatureLayer({
        source: [],
        geometryType: 'polygon',
        objectIdField: 'ObjectID',
        displayField: 'ObjectID',
        fields: [
          { name: 'ObjectID', alias: 'ObjectID', type: 'string' },
          { name: 'Name', alias: 'Name', type: 'string' },
        ],
        labelingInfo: [{
          symbol: {
            type: "text",
            color: "red",
            haloColor: "black",
          },
          labelPlacement: "above-center",
          labelExpressionInfo: {
            expression: "$feature.Name"
          }
        }],
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

      const polylineFeatureLayer = new FeatureLayer({
        source: [],
        geometryType: 'polyline',
        objectIdField: 'ObjectID',
        displayField: 'ObjectID',
        fields: [
          { name: 'ObjectID', alias: 'ObjectID', type: 'string' },
          { name: 'Name', alias: 'Name', type: 'string' },
        ],
        labelingInfo: [{
          symbol: {
            type: "text",
            color: "red",
            haloColor: "black",
          },
          labelPlacement: "above-center",
          labelExpressionInfo: {
            expression: "$feature.Name"
          }
        }],
        renderer: {
          type: "simple", // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-line",  // autocasts as new SimpleLineSymbol()
            color: "red",
            width: "2px",
            style: "short-dot"
          }
        }
      })

      const pointFeatureLayer = new FeatureLayer({
        source: [],
            geometryType: 'point',
            objectIdField: 'ObjectID',
            fields: [
              { name: 'ObjectID', alias: 'ObjectID', type: 'string' },
              { name: 'Name', alias: 'Name', type: 'string' },
            ],
            labelingInfo: [{
              symbol: {
                type: "text",
                color: "red",
                haloColor: "black",
              },
              labelPlacement: "above-center",
              labelExpressionInfo: {
                expression: "$feature.Name"
              }
            }],
            renderer: {
              type: "simple", // autocasts as new SimpleRenderer()
              symbol: {
                type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                style: "square",
                color: "blue",
                size: "8px",  // pixels
                outline: {  // autocasts as new SimpleLineSymbol()
                  color: [ 255, 255, 0 ],
                  width: 3  // points
                }
              }
            }
      })

      map.add(this.polygonFeatureLayer = featureLayer)
      map.add(this.polylineFeatureLayer = polylineFeatureLayer)
      map.add(this.pointFeatureLayer = pointFeatureLayer)
      map.add(this.graphicsLayer = graphicsLayer)

      testPolygonGraphicJson.attributes.ObjectID = '001'
      testPolygonGraphicJson.attributes.Name = 'T001'
      const g = Graphic.fromJSON(testPolygonGraphicJson)

      graphicsLayer.add(g.clone())
      // g.layer = graphicsLayer

      featureLayer.applyEdits({ addFeatures: [g] })
      g.layer = featureLayer

    
      const sketch = window.sketch = new Sketch({
        view,
        updateOnGraphicClick: false,
      }, {
        beforeComplete: graphic => {
          graphic.attributes = graphic.attributes || {}
          graphic.attributes.ObjectID = '123'
          graphic.attributes.Name = 'XXXX' + Date.now()
          // return graphic
        }
      })

      // sketch.create(polylineFeatureLayer)
      // sketch.create(polylineFeatureLayer, 'polyline')
      // sketch.update(g)

      view.on('click', e => {
        view.hitTest(e).then(({ results }) => {
          const selectedGraphics = results.filter(r => r.graphic.layer.type === 'feature' || r.graphic.layer.type === 'graphics').map(r => r.graphic)
          sketch.update(selectedGraphics[0])
        })
      })
    })
    
  }

  render () {
    const { map, view } = this.state    
    const TOOLS = [{
      key: 'draw',
      icon: 'edit',
      label: '绘制',
      optionsBar: map ? <DrawOptionsBar 
        map={map} 
        view={view} 
        targetLayer={tool => {
          const featureLayers = {
            point: this.pointFeatureLayer,
            polyline: this.polylineFeatureLayer,
            polygon: this.polygonFeatureLayer
          }
          return featureLayers[tool]
        }}
        beforeCompleteSketch={graphic => {
          graphic.attributes = graphic.attributes || {}
          graphic.attributes.Name = 'XXXX' + Date.now()
        }}
      /> : null
    }]

    return (
      <Map onLoad={this.onLoad}>
        <Toolbar tools={TOOLS} />
      </Map>
    )
  }
}
