import { Component } from 'react'
import PropTypes from 'prop-types'
import EsriModuleLoader from 'esri-module-loader'
import { toMecator } from '../../../utils/geometry'

const loadModules = () => EsriModuleLoader.loadModules([
  'esri/widgets/Sketch/SketchViewModel',
  'esri/layers/GraphicsLayer',
  'esri/Graphic'
])

// point | multipoint | polyline | polygon | circle | rectangle | move | transform | reshape
export const ACTIVE_TOOLS = {
  POINT: 'point',
  MULTIPOINT: 'multipoint',
  POLYLINE: 'polyline',
  POLYGON: 'polygon',
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
  MOVE: 'move',
  TRANSFORM: 'transform',
  RESHAPE: 'reshape'
}

export const CREATE_MODES = {
  HYBRID: 'hybrid',       // applicable for polyline and polygon
  FREEHAND: 'freehand',   // applicable for polygon, polyline, rectangle, circle
  CLICK: 'click'          // applicable for point
}

/**
 * <Sketch view layer graphics={} tool="polyline" mode="freehand">
 *  <Button icon="line">POLYLINE</Button>
 * </Sketch>
 * 
 * It should be able to:
 *   1. interupt (cancel/redo/undo) outside of this component
 *   2. click event should not be mixed up with other map click events
 * 
 *
 * SketchViewModel 使用的是 GraphicsLayer，如果想编辑 FeatureLayer，需要：
 *   1. FeatureLayer 中选中逻辑，获取到选中的 graphic
 *   2. 在 sketchViewModel 自己的 graphicsLayer 中复制一份上面的 graphic，并隐藏 FeatureLayer 中的 graphic
 *   3. sketchViewModel.update([clonedGraphic])
 *   4. 编辑完成后，featureLayer.applyEdits 来完成更新
 */
class Sketch extends Component {
  constructor (props) {
    super(props)
    
  }

  componentWillMount () {
    loadModules().then(({ SketchViewModel, GraphicsLayer, Graphic }) => {
      const { view, map } = this.props
      const layer = new GraphicsLayer()

      const g = new Graphic({
        geometry: {
          type: "polygon",
          rings: [
            [-34.07, 32.3],
            [-20.21, 15.78],
            [-14.78, 22.3],
            [-34.07, 32.3]
          ].map(p => toMecator(p)),
          spatialReference: { wkid: 102100 } // 这里必须使用 大地坐标，如果使用 经纬度，在 svm.update 后，坐标会转换，导致坐标混乱
        },
        symbol: {
          type: "simple-fill",
          color: [227, 139, 79, 0.8],
          outline: {
            color: [255, 255, 255],
            width: 1
          }
        }
      })

      layer.add(g)
      map.add(layer)

      const svm = new SketchViewModel({
        view,
        layer,
        updateOnGraphicClick: false,
        defaultUpdateOptions: { // set the default options for the update operations
          toggleToolOnClick: false // only reshape operation will be enabled
        }
      })

      // svm.create("rectangle")
      view.on('click', e => {
        console.log('-click-')
        if (svm.state === "active") {
          console.log('skip')
          return;
        }

        view.hitTest(e).then(r => {
          const re = r.results.find(r => r.graphic.layer === svm.layer)
          if (re) {
            console.log('find it', re.graphic)
            svm.update([re.graphic], { tool: 'reshape' })
            window.sketch = svm
          }
        })
      })

      svm.on('create', e => {
        console.log('create', e)
        return
        if (e.state === 'complete') {
          console.log('create svm', e, view.graphics.items.length)
          // svm.create("circle")
        }
      })

      svm.on('update', e => {
        console.log('update', e)
        if ((e.state === "cancel" || e.state === "complete"))  {
          // svm.update(e.graphics, { tool: 'reshape' })
        }
      })
      
      
    })
  }

  render () {
    console.log('SketchPolyline', this.props)
    return null
  }
}

Sketch.propTypes = {
  
  sketchViewModelProperties: PropTypes.object
}

Sketch.defaultProps = {
  view: undefined,
  layer: undefined,
  graphics: [],
  mode: undefined
}

export default Sketch
