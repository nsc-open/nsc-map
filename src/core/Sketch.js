import EventEmitter from 'eventemitter3'
import { loadModules } from 'esri-module-loader'

const addGraphic = (layer, graphic) => {
  if (layer.type === 'graphics') {
    layer.add(graphic)
  } else if (layer.type === 'feature') {
    layer.applyEdits({
      addFeatures: [graphic]
    })
  } else {
    throw new Error('not supported layer', layer)
  }
}

const removeGraphic = (layer, graphic) => {
  if (layer.type === 'graphics') {
    layer.remove(graphic)
  } else if (layer.type === 'feature') {
    layer.applyEdits({
      deleteFeatures: [graphic]
    })
  } else {
    throw new Error('not supported layer', layer)
  }
}
/**
 * usage:
 *  const sketch = new Sketch({
 *    view,   // mapView
 *    layers  // target layers, it can be graphicsLayer or featureLayer
 *  })
 * 
 * sketch.create(options)
 * 
 * sketch.update(graphic, options)
 * 
 * sketch.apply() // apply edits
 * 
 * sketch.on('', () => {})
 */

class Sketch extends EventEmitter {

  constructor ({ view, ...sketchViewModelProperties }) {
    super()

    if (!view) {
      throw new Error('view is required')
    }

    this.view = view
    this.sketchViewModelProperties = sketchViewModelProperties
    this.sketchViewModel = null

    this.sourceLayer = null // source layer for create and update, it can be graphicsLayer or featureLayer
    this.sourceGraphic = null
    this.state = 'ready' // ready|create|update|complete|cancel
  }

  // always create a temp graphics layer for sketch, for both create or update. So this would have a unified
    // way to handle FeatureLayer and GraphicsLayer

    // for create, graphic needs to be remove from this temp graphicsLayer and add into the target layer
    // for update, graphics need to be edited should be hidden first, and clone into this temp graphicsLayer and do the update
    // once update complete, need to apply the updated graphics back to the source layer
  _createSketchViewModel (props = {}) {
    if (this.sketchViewModel) {
      this.sketchViewModel.layer.removeAll()
      this.sketchViewModel.reset()
      this.sketchViewModel = null
    }

    return loadModules([
      'esri/widgets/Sketch/SketchViewModel',
      'esri/layers/GraphicsLayer'
    ]).then(({ SketchViewModel, GraphicsLayer }) => {
      const { view } = this
      const tempGraphicsLayer = new GraphicsLayer()
      view.map.add(tempGraphicsLayer)
      return new SketchViewModel({
        ...this.sketchViewModelProperties,
        ...props,
        view,
        layer: tempGraphicsLayer
      })
    })
  }

  _applyComplete (editingGraphic) {
    const { sourceLayer } = this
    const newGraphic = editingGraphic.clone()
    addGraphic(sourceLayer, newGraphic)
    this.state = 'ready'
  }

  _applyCancel () {
    const { sourceLayer, sourceGraphic } = this
    addGraphic(sourceLayer, sourceGraphic)
    this.state = 'ready'
  }

  _unbindEvents () {

  }

  destroy () {
    
  }

  create (sourceLayer, tool) {
    this.state = 'create'
    this.sourceLayer = sourceLayer
    this.sourceGraphic = null
  
    this._createSketchViewModel().then(sketchViewModel => {
      sketchViewModel.create(tool)
      sketchViewModel.on(['redo', 'undo', 'create', 'update'], e => {
        let editingGraphic = null
        if (e.type === 'create') {
          editingGraphic = e.graphic
        } else if (e.type === 'update') {
          editingGraphic = e.graphics[0]
        }
        editingGraphic.layer = sketchViewModel.layer

        if (this.state === 'complete' && e.state === 'complete') {
          sketchViewModel.layer.removeAll()
          this._applyComplete(editingGraphic)
        } else if (this.state === 'cancel' && e.state === 'cancel') {
          sketchViewModel.layer.removeAll()
        } else if (['complete', 'cancel'].includes(e.state)) {
          sketchViewModel.update([editingGraphic], { tool: 'reshape' })
        }
      })

      this.sketchViewModel = sketchViewModel
    })
  }

  update (sourceLayer, graphic) {
    this.state = 'update'
    this.sourceLayer = sourceLayer
    this.sourceGraphic = graphic.clone()

    this._createSketchViewModel().then(sketchViewModel => {
      removeGraphic(sourceLayer, graphic)
      sketchViewModel.layer.add(graphic)
      graphic.layer = sketchViewModel.layer // this has to be set manually, otherwise the sync code after won't see graphic added into the layer

      sketchViewModel.update([graphic], { tool: 'reshape' })

      sketchViewModel.on(['redo', 'undo', 'update'], e => {
        if (this.state === 'complete' && e.state === 'complete') {
          sketchViewModel.layer.removeAll()
          this._applyComplete(e.graphics[0])
        } else if (this.state === 'cancel' && e.state === 'cancel') {
          sketchViewModel.layer.removeAll()
          this._applyCancel()
        } else if (['complete', 'cancel'].includes(e.state)) {
          sketchViewModel.update(e.graphics, { tool: 'reshape' })
        }
      })
  
      this.sketchViewModel = sketchViewModel
    })
  }

  complete () {
    this.state = 'complete'
    this.sketchViewModel.complete()
  }

  cancel () {
    this.state = 'cancel'
    this.sketchViewModel.cancel()
  }
}

export default Sketch