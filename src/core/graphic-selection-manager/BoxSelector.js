import BaseSelector from './BaseSelector'
import { loadModules } from 'esri-module-loader'
import { SELECTOR_TYPE } from './constants'

class BoxSelector extends BaseSelector {
  
  constructor (args) {
    super(args)

    this.type = SELECTOR_TYPE.BOX
    
    this._tempGraphicsLayer = null
    this._startPoint = null
    this._boxGraphic = null
    this._handlers = []

    this._status = '' // initiating, ready, destroying
  }

  _init () {
    return loadModules([
      'esri/layers/GraphicsLayer',
      'esri/geometry/Polygon',
      'esri/geometry/Extent', // preload
      'esri/geometry/geometryEngine', // preload
      'esri/Graphic'
    ]).then(({ GraphicsLayer, Polygon, Graphic }) => {
      const { view, layers } = this.gsm
      const { map } = view
      const graphicsLayer = new GraphicsLayer({ id: '__box_selector_temp_graphics_layer__' })
      const boxGraphic = new Graphic({
        geometry: new Polygon({
          rings: [],
          spatialReference: { wkid: layers[0].spatialReference.wkid }
        }),
        symbol: {
          type: "simple-fill",
          color: [0, 0, 0, .1],
          style: "solid",
          outline: {
            color: [0, 0, 0, .9],
            width: 1
          }
        }
      })

      graphicsLayer.add(this._boxGraphic = boxGraphic)
      map.add(this._tempGraphicsLayer = graphicsLayer)
    })
  }

  _bindEvents () {
    const { view } = this.gsm
    this._handlers = [
      view.on('drag', this._dragHandler)
    ]
  }

  _unbindEvents () {
    this._handlers.forEach(h => h.remove())
  }

  _dragHandler = e => {
    e.stopPropagation()
    if (e.action === 'start') {
      this._dragStartHandler(e)
    } else if (e.action === 'end') {
      this._dragEndHandler(e)
    } else if (e.action === 'update') {
      this._dragUpdateHandler(e)
    }
  }

  _dragStartHandler = e => {
    e.stopPropagation()
    loadModules('esri/geometry/Polygon').then(Polygon => {
      const { x, y } = e
      const { view, layers } = this.gsm
      this._startPoint = view.toMap({ x, y })
      this._boxGraphic.geometry = new Polygon({
        rings: [],
        spatialReference: { wkid: layers[0].spatialReference.wkid }
      })
      this._tempGraphicsLayer.add(this._boxGraphic)
    })
  }

  _dragUpdateHandler = e => {
    if (this._startPoint) {
      e.stopPropagation()
      loadModules([
        'esri/geometry/Polygon',
        'esri/geometry/Extent'
      ]).then(({ Polygon, Extent }) => {
        const { x, y } = e
        const { view, layers } = this.gsm
        const mapPoint = view.toMap({ x, y })
        const ext = new Extent({
          xmin: Math.min(this._startPoint.x, mapPoint.x), ymin: Math.min(this._startPoint.y, mapPoint.y),
          xmax: Math.max(this._startPoint.x, mapPoint.x), ymax: Math.max(this._startPoint.y, mapPoint.y),
          spatialReference: { wkid: layers[0].spatialReference.wkid }
        })
  
        this._boxGraphic.geometry = Polygon.fromExtent(ext)
      })      
    }
  }

  _dragEndHandler = e => {
    if (this._boxGraphic) {
      e.stopPropagation()
      this._computeIntersects(this._boxGraphic.geometry)
      this._tempGraphicsLayer.remove(this._boxGraphic)
      this._startPoint = null
    }
  }

  _computeIntersects (boxGeometry) {
    loadModules('esri/geometry/geometryEngine').then(geometryEngine => {
      const { layers, selectionManager } = this.gsm
      const graphicsLayers = layers.filter(l => l.type === 'graphics')
      const featureLayers = layers.filter(l => l.type === 'feature')

      const selectedGraphics = []
      graphicsLayers.forEach(graphicLayer => {
        graphicLayer.graphics.forEach(g => {
          if (geometryEngine.intersects(boxGeometry, g.geometry)) {
            selectedGraphics.push(g)
          }
        })
      })

      Promise.all(
        featureLayers.map(layer => layer.queryFeatures())
      ).then(results => {
        results.forEach(result => {
          result.features.forEach(g => {
            if (geometryEngine.intersects(boxGeometry, g.geometry)) {
              selectedGraphics.push(g)
            }
          })
        })
        selectionManager.select(selectedGraphics)
      }) 
    })
  }

  destroy () {
    const { map } = this.gsm.view
    if (this._tempGraphicsLayer) {
      if (this._boxGraphic) {
        this._tempGraphicsLayer.remove(this._boxGraphic)
        this._boxGraphic = null
      }
      map.remove(this._tempGraphicsLayer)
      this._tempGraphicsLayer = null
    }
  }

  activate () {
    this._init().then(_ => {
      this._bindEvents()
    })
  }

  deactivate () {
    this._unbindEvents()
  }
}

export default BoxSelector