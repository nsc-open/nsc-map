import EventEmitter from 'eventemitter3';
import EsriModuleLoader from 'esri-module-loader';
/**
 * Use AreaMeasurement2DViewModel
 * TODO: XXViewModel 的重复实例化会导致地图上反复添加新的 graphicsLayer
 * 
 * events: ready | update
 * 
 */

class AreaMeasurement extends EventEmitter {
  constructor({
    view
  }) {
    super();
    EsriModuleLoader.loadModules(['esri/widgets/AreaMeasurement2D/AreaMeasurement2DViewModel']).then(({
      AreaMeasurement2DViewModel
    }) => {
      this.viewModel = new AreaMeasurement2DViewModel({
        view,
        mode: 'planar',
        unit: 'square-kilometers'
      });
      this.viewModel.watch('measurementLabel', () => {
        if (!this.viewModel || !this.viewModel.measurement) {
          // this.destroy() will trigger this watch, and this.viewModel is null then
          return;
        }

        const {
          unit,
          measurement
        } = this.viewModel;
        const {
          area
        } = measurement;
        this.emit('update', {
          area,
          unit
        });
      });
      this.newMeasurement();
      this.emit('ready');
    });
  }

  newMeasurement() {
    this.viewModel.newMeasurement();
  }

  clearMeasurement() {
    this.viewModel.clearMeasurement();
  }

  destroy() {
    this.clearMeasurement();
    this.viewModel = null;
  }

}

export default AreaMeasurement;