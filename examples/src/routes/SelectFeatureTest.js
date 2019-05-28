import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import Toolbar from 'nsc-map/components/tools/toolbar/Toolbar'
import SelectOptionsBar from 'nsc-map/components/tools/select/SelectOptions'
import { loadModules } from 'esri-module-loader'
import GraphicSelectionManager from 'nsc-map/core/graphic-selection-manager/GraphicSelectionManager'
import { polygon, polygon1, polyline } from 'mock/geometry-jsons'
const testPolygonGraphicJson = JSON.parse('{"geometry":{"spatialReference":{"latestWkid":3857,"wkid":102100},"rings":[[[-13412744.469982473,6081291.325808455],[-13174260.941732787,6080068.333355892],[-13209727.722857099,5998127.839034205],[-13272100.337937785,5814678.971149831],[-13544827.654859222,5885612.533398456],[-13412744.469982473,6081291.325808455]]]},"symbol":{"type":"esriSFS","color":[0,0,0,51],"outline":{"type":"esriSLS","color":[255,0,0,255],"width":2,"style":"esriSLSSolid"},"style":"esriSFSSolid"},"attributes":{}}')

export default class extends Component {
  state = {
    map: null,
    view: null
  }

  createGraphicSelectionManager (map, view) {
    return
    const gsm = new GraphicSelectionManager({ view })
    gsm.activate({ type: 'pointer' })
    window.gsm = gsm

    gsm.addLayer(this.polygonFeatureLayer)
    gsm.addLayer(this.polylineFeatureLayer)
    // gsm.addLayer(this.graphicsLayer)

    gsm.on('selectionChange', e => console.log('selectionChange', e))
  
  }

  onLoad = (map, view) => {
    

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

      featureLayer.applyEdits({ addFeatures: [
        
        Graphic.fromJSON(polygon),
        Graphic.fromJSON(polygon1),
      ] })

      polylineFeatureLayer.applyEdits({ addFeatures: [
        Graphic.fromJSON(polyline),
        
      ] })

      this.createGraphicSelectionManager(map, view)

      this.setState({ map, view })
    })
    
  }

  render () {
    const { map, view } = this.state    
    const TOOLS = map ? [{
      key: 'select',
      icon: 'edit',
      label: '选择',
      optionsBar: 
      <SelectOptionsBar
        ref={c => window.x = c}
        view={view}
        map={view}
        sourceLayers={[this.polygonFeatureLayer, this.polylineFeatureLayer]}
        onSelectionChange={e => console.log(e)}
      />
    }] : []

    return (
      <Map onLoad={this.onLoad}>
        <Toolbar tools={TOOLS} />
      </Map>
    )
  }
}
