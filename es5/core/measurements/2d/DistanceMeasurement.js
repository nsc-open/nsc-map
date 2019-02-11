import EventEmitter from 'eventemitter3';
import EsriModuleLoader from 'esri-module-loader';
/**
 * events: ready | update
 */

class DistanceMeasurement extends EventEmitter {
  constructor({
    view
  }) {
    super();
    EsriModuleLoader.loadModules(['esri/widgets/DistanceMeasurement2D/DistanceMeasurement2DViewModel']).then(({
      DistanceMeasurement2DViewModel
    }) => {
      this.viewModel = new DistanceMeasurement2DViewModel({
        view,
        mode: 'planar',
        unit: 'kilometers'
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
          length
        } = measurement;
        this.emit('update', {
          length,
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

export default DistanceMeasurement;