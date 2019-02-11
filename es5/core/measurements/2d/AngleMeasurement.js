import EventEmitter from 'eventemitter3';
import EsriModuleLoader from 'esri-module-loader';
/**
 * Use SketchViewModel to implement this measurement
 * events: ready | update
 */

class AngleMeasurement extends EventEmitter {
  constructor({
    view
  }) {
    super();
    this.view = view;
    this.graphicsLayer = null;
    this.sketchViewModel = null;

    this._init();
  }

  _init() {
    EsriModuleLoader.loadModules(['esri/Graphic', 'esri/layers/GraphicsLayer', 'esri/widgets/Sketch/SketchViewModel']).then(({
      Graphic,
      GraphicsLayer,
      SketchViewModel
    }) => {
      const graphicsLayer = new GraphicsLayer();
      const sketchViewModel = new SketchViewModel({
        view: this.view,
        layer: graphicsLayer,
        updateOnGraphicClick: false,
        defaultUpdateOptions: {
          toggleToolOnClick: false
        }
      });
      this.view.map.add(graphicsLayer);
      this.graphicsLayer = graphicsLayer;
      this.sketchViewModel = sketchViewModel;
      this.newMeasurement();
    });
  }

  _bindEvents() {}

  _unbindEvents() {}

  newMeasurement() {
    const {
      sketchViewModel
    } = this;
    sketchViewModel.create('polyline');
    sketchViewModel.on('create', ({
      graphic,
      state
    }) => {
      console.log(graphic, state);
    });
  }

  clearMeasurement() {// this.viewModel.clearMeasurement()
  }

  destroy() {// this.clearMeasurement()
    // this.viewModel = null
  }

}

export default AngleMeasurement;