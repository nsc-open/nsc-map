import EventEmitter from 'eventemitter3';
import EsriModuleLoader from 'esri-module-loader';
/**
 * events: ready | update
 */

class AngleMeasurement extends EventEmitter {
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
        if (!this.viewModel) {
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

export default AngleMeasurement;