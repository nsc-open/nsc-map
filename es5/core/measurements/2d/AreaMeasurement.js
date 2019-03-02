import EventEmitter from 'eventemitter3';
import { loadModules } from 'esri-module-loader';
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
    this.viewModel = null;
    this.destroyed = false;
    loadModules(['esri/widgets/AreaMeasurement2D/AreaMeasurement2DViewModel']).then(({
      AreaMeasurement2DViewModel
    }) => {
      if (this.destroyed) {
        return;
      }

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
    this.viewModel && this.viewModel.clearMeasurement();
  }

  destroy() {
    this.clearMeasurement(); // the DistanceMeasurement2DViewModel doesn't provide a nice destory function
    // so needs to do it myself

    this.viewModel.tool.destroy();
    this.viewModel.view.cursor = 'default';
    this.viewModel = null;
    this.destroyed = true;
  }

}

export default AreaMeasurement;