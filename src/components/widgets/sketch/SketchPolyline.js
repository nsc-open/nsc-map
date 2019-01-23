import { Component } from 'react'
import PropTypes from 'prop-types'
import EsriModuleLoader from 'esri-module-loader'

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
            [-54.78, 12.3],
            [-46.07, 18.45],
            [-60.21, 25.78],
            [-54.78, 12.3]
          ]
        },
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [227, 139, 79, 0.8],
          outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 1
          }
        }
      })

      layer.add(g)
      map.add(layer)
      const svm = new SketchViewModel({
        view,
        layer// : view.graphics
      })

      console.log('sketch', svm, view.graphics.items.length)
      // svm.create("rectangle")
      
      view.on('click', e => {
        view.hitTest(e).then(r => {
          const re = r.results.find(r => r.graphic.layer === layer)
          console.log('find it', re.graphic)
          svm.update([re.graphic], { tool: 'move', toggleToolOnClick: false })
        })
      })

      svm.on('create', e => {
        if (e.state === 'complete') {
          console.log('create svm', e, view.graphics.items.length)
          // svm.create("circle")
        }
      })

      svm.on('update', e => {
        console.log('update', e)

        const toolType = e.toolEventInfo.type;
        if (toolType === 'move-stop') {
          svm.complete()
        } else if ((e.state === "cancel" || e.state === "complete")) {
          svm.update({
            tool: "move",
            graphics: e.graphics,
            toggleToolOnClick: false
          })
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
