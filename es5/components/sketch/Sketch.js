function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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
  constructor(_ref) {
    let {
      view
    } = _ref,
        restSketchViewModelProperties = _objectWithoutProperties(_ref, ["view"]);

    if (!view) {
      throw new Error('view is required');
    }

    if (!layers || layers.length === 0) {
      throw new Error('layers cannot by empty');
    }

    this.view = view;
    this.sketchViewModelProperties = _objectSpread({
      view,
      layer: view.graphics
    }, restSketchViewModelProperties);
    this.sketchViewModel = null;
  }

  _createSketchViewModel() {
    return new SketchViewModel(this.sketchViewModelProperties);
  }

  _applyCreate() {}

  _applyUpdate() {}

  _cancelCreate() {}

  _cancelUpdate() {}

  _bindCreateEvents() {
    this.sketchViewModel.on('create', e => {
      if (e.state === 'complete') {
        this._applyCreate();
      } else if (e.state === 'cancel') {}
    });
  }

  _bindUpdateEvents() {
    this.sketchViewModel.on('update', e => {
      if (e.state === 'complete') {
        this._applyUpdate();
      } else if (e.state === 'cancel') {}
    });
  }

  _unbindEvents() {}

  destroy() {
    this.view = null;
    this.layers = [];

    this._unbindEvents();

    if (this.sketchViewModel) {
      this.sketchViewModel.reset();
      this.sketchViewModel = null;
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


  create(targetLayer, // the layer that will be applied the creation
  ...args) {
    this.sketchViewModel = this._createSketchViewModel();
    this.sketchViewModel.create(...args);
  }

  update(...args) {}

  complete() {}

  cancel() {}

  undo() {}

  redo() {}

  reset() {}

  on(...args) {}

}