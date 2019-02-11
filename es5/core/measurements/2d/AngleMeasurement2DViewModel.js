import EventEmitter from 'eventemitter3';
import EsriModuleLoader from 'esri-module-loader';

class AngleMeasurement2DViewModel {
  constructor({
    view
  }) {
    this.view = view;
    this.measureLabel = '';
    this.unit = '';
    this.measurement = null;
    this.sketchViewModel = null;
    this.graphicsLayer = null;

    this._init();
  }

  _init() {
    EsriModuleLoader.loadModules(['esri/layers/GraphicsLayer', 'esri/widgets/Sketch/SketchViewModel']).then(({
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
    });
  }

  destroy() {
    this.view.map.remove(this.graphicsLayer);
    this.sketchViewModel = null;
    this.graphicsLayer = null;
  }

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

  clearMeasurement() {}

}

export default AngleMeasurement2DViewModel;