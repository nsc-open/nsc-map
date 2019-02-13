import EventEmitter from 'eventemitter3'
import AngleMeasurement2DViewModel from './AngleMeasurement2DViewModel'

/**
 * Use SketchViewModel to implement this measurement
 * events: ready | update
 */
class AngleMeasurement extends EventEmitter {
  constructor ({ view }) {
    super()
    this.destroyed = false
    this.viewModel = new AngleMeasurement2DViewModel({ view })
    this.viewModel.newMeasurement()
  }

  newMeasurement () {
    this.viewModel.newMeasurement()
  }

  clearMeasurement () {
    this.viewModel && this.viewModel.clearMeasurement()
  }

  destroy () {
    if (this.viewModel) {
      this.viewModel.destroy()
      this.viewModel = null
    }
    this.destroyed = true
  }
}

export default AngleMeasurement