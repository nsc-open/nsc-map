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

class Sketch {

  constructor ({ view, ...restSketchViewModelProperties }) {
    if (!view) {
      throw new Error('view is required')
    }

    if (!layers || layers.length === 0) {
      throw new Error('layers cannot by empty')
    }

    this.view = view
    this.sketchViewModelProperties = {
      view,
      layer: view.graphics,
      ...restSketchViewModelProperties
    }
    this.sketchViewModel = null

    
  }

  _createSketchViewModel () {
    return new SketchViewModel(this.sketchViewModelProperties)
  }

  _applyCreate () {

  }

  _applyUpdate () {

  }

  _cancelCreate () {

  }

  _cancelUpdate () {

  }

  _bindCreateEvents () {
    this.sketchViewModel.on('create', e => {
      if (e.state === 'complete') {
        this._applyCreate()
      } else if (e.state === 'cancel') {

      }
    })
  }

  _bindUpdateEvents () {
    this.sketchViewModel.on('update', e => {
      if (e.state === 'complete') {
        this._applyUpdate()
      } else if (e.state === 'cancel') {
        
      }
    })
  }

  _unbindEvents () {

  }

  destroy () {
    this.view = null
    this.layers = []
    this._unbindEvents()

    if (this.sketchViewModel) {
      this.sketchViewModel.reset()
      this.sketchViewModel = null
    }
  }

  /**
   * new Sketch(view, groundObjectLayer, ...)
   * sketch.create() // once complete, will apply edits into one of point/polyline/polygon featureLayers
   * sketch.update(groundObject)  // once complete, will be apply edits to responding featureLayer
   * 
   * @param {*} targetLayer 
   * @param  {...any} args 
   */
  create (
    targetLayer, // the layer that will be applied the creation
    ...args
  ) {
    this.sketchViewModel = this._createSketchViewModel()
    this.sketchViewModel.create(...args)
    
  }

  update (...args) {

  }

  complete () {

  }

  cancel () {

  }

  undo () {

  }

  redo () {

  }

  reset () {

  }

  on (...args) {

  }
}