function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import EventEmitter from 'eventemitter3';
import { loadModules } from 'esri-module-loader';

const addGraphic = (layer, graphic) => {
  if (layer.type === 'graphics') {
    layer.add(graphic);
  } else if (layer.type === 'feature') {
    layer.applyEdits({
      addFeatures: [graphic]
    });
  } else {
    throw new Error('not supported layer', layer);
  }
};

const removeGraphic = (layer, graphic) => {
  if (layer.type === 'graphics') {
    layer.remove(graphic);
  } else if (layer.type === 'feature') {
    layer.applyEdits({
      deleteFeatures: [graphic]
    });
  } else {
    throw new Error('not supported layer', layer);
  }
};
/**
 * This sketch handles GraphicsLayer and FeatureLayer
 * 
 * usage:
 * 
 * const sketch = new Sketch({ view }, {
 *  beforeComplete: graphic => {
 *    // set graphic attributes 
 *    // update geometryJson
 *    // return Promise.resolve(graphic) // then apply the complete to the layer
 *  }
 * })
 * 
 * sketch.create(sourceGraphicsLayer, 'polyline')
 * sketch.create(sourceFeatureLayer)  // tool can be omitted here, it will be inferred from featureLayer
 * sketch.update(graphic)
 * sketch.update(sourceLayer, graphic)
 * 
 * sketch.destroy()
 */


class Sketch extends EventEmitter {
  constructor(_ref, options = {
    beforeComplete: null
  }) {
    let {
      view
    } = _ref,
        sketchViewModelProperties = _objectWithoutProperties(_ref, ["view"]);

    super();

    if (!view) {
      throw new Error('view is required');
    }

    this.options = options || {};
    this.view = view;
    this.sketchViewModelProperties = sketchViewModelProperties;
    this.sketchViewModel = null;
    this.sourceLayer = null; // source layer for create and update, it can be graphicsLayer or featureLayer

    this.sourceGraphic = null;
    this.state = 'ready'; // ready|create|update|complete|cancel

    this._eventHandlers = [];
  } // always create a temp graphics layer for sketch, for both create or update. So this would have a unified
  // way to handle FeatureLayer and GraphicsLayer
  // for create, graphic needs to be remove from this temp graphicsLayer and add into the target layer
  // for update, graphics need to be edited should be hidden first, and clone into this temp graphicsLayer and do the update
  // once update complete, need to apply the updated graphics back to the source layer


  _createSketchViewModel(props = {}) {
    this._resetSketchViewModel();

    return loadModules(['esri/widgets/Sketch/SketchViewModel', 'esri/layers/GraphicsLayer']).then(({
      SketchViewModel,
      GraphicsLayer
    }) => {
      const {
        view
      } = this;
      const tempGraphicsLayer = new GraphicsLayer();
      view.map.add(tempGraphicsLayer);
      return new SketchViewModel(_objectSpread({}, this.sketchViewModelProperties, props, {
        view,
        layer: tempGraphicsLayer,
        updateOnGraphicClick: false,
        defaultUpdateOptions: {
          tool: 'reshape'
        }
      }));
    });
  }

  _applyComplete(editingGraphic) {
    const newGraphic = editingGraphic.clone(); // need a beforeCreate handler, to give chance to modify new graphic
    // and also give chance to stop add graphic

    let {
      beforeComplete
    } = this.options;

    if (!beforeComplete) {
      beforeComplete = () => newGraphic;
    }

    const rtn = beforeComplete(newGraphic);

    const _then = modifiedGraphic => {
      if (modifiedGraphic === false) {
        this.state = 'ready';
        return; // stop apply complete
      }

      addGraphic(this.sourceLayer, modifiedGraphic || newGraphic);
      this.state = 'ready';
    };

    if (rtn && rtn.then) {
      rtn.then(_then);
    } else {
      _then(rtn);
    }
  }

  _applyCancel() {
    const {
      sourceLayer,
      sourceGraphic
    } = this;

    if (sourceGraphic) {
      // for create() has no sourceGraphic
      addGraphic(sourceLayer, sourceGraphic);
    }

    this.state = 'ready';
  }

  _bindEvents(sketchViewModel) {
    this._eventHandlers = [sketchViewModel.on(['redo', 'undo', 'create', 'update'], e => {
      let editingGraphic = null;

      if (e.type === 'create') {
        editingGraphic = e.graphic;
      } else if (e.type === 'update') {
        editingGraphic = e.graphics[0];
      }

      if (!editingGraphic) {
        return;
      }

      editingGraphic.layer = sketchViewModel.layer;

      if (this.state === 'complete' && e.state === 'complete') {
        sketchViewModel.layer.removeAll();

        this._applyComplete(editingGraphic);
      } else if (this.state === 'cancel' && e.state === 'cancel') {
        sketchViewModel.layer.removeAll();

        this._applyCancel();
      } else if (['complete', 'cancel'].includes(e.state)) {
        sketchViewModel.update([editingGraphic]);
      }
    })];
  }

  _unbindEvents() {
    this._eventHandlers.forEach(h => h.remove());

    this._eventHandlers = [];
  }

  _resetSketchViewModel() {
    if (this.sketchViewModel) {
      this._unbindEvents();

      this.view.map.remove(this.sketchViewModel.layer);
      this.sketchViewModel.layer.removeAll();
      this.sketchViewModel.reset();
      this.sketchViewModel = null;
    }
  }

  destroy() {
    this._resetSketchViewModel();

    this.view = null;
    this.sketchViewModelProperties = null;
    this.sourceGraphic = null;
    this.sourceLayer = null;
    this.state = '';
  }
  /**
   * for graphicsLayer: create(graphicsLayer, 'polygon')
   * for featureLayer: create(featureLayer) // tool will be inferred with featureLayer.geometryType
   */


  create(sourceLayer, tool) {
    this.state = 'create';
    this.sourceLayer = sourceLayer;
    this.sourceGraphic = null;

    if (sourceLayer.type === 'feature') {
      tool = sourceLayer.geometryType;
    }

    this._createSketchViewModel().then(sketchViewModel => {
      sketchViewModel.create(tool);

      this._bindEvents(sketchViewModel);

      this.sketchViewModel = sketchViewModel;
    });
  }
  /**
   * update(graphic) // sourceLayer will be use graphic.layer
   * update(sourceLayer, graphic) // or you can specify sourceLayer
   */


  update(
  /* sourceLayer, graphic */
  ...args) {
    let sourceLayer, graphic;

    if (args.length === 1) {
      // update(graphic)
      graphic = args[0];
      sourceLayer = graphic.layer;
    } else if (args.length === 0) {
      // update(layer, graphic)
      sourceLayer = args[0];
      graphic = args[1];
    }

    this.state = 'update';
    this.sourceLayer = sourceLayer;
    this.sourceGraphic = graphic.clone();

    this._createSketchViewModel().then(sketchViewModel => {
      removeGraphic(sourceLayer, graphic);
      sketchViewModel.layer.add(graphic);
      graphic.layer = sketchViewModel.layer; // this has to be set manually, otherwise the sync code after won't see graphic added into the layer

      sketchViewModel.update([graphic]);

      this._bindEvents(sketchViewModel);

      this.sketchViewModel = sketchViewModel;
    });
  }

  complete() {
    this.state = 'complete';
    this.sketchViewModel.complete();
  }

  cancel() {
    this.state = 'cancel';
    this.sketchViewModel.cancel();
  }

}

export default Sketch;