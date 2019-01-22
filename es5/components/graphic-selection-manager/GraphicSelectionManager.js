function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import EventEmitter from 'eventemitter3';
import SelectionManager from '../../utils/SelectionManager';
import PointerSelector from './PointerSelector';
import { SELECTOR_TYPE } from './constants';
/**
 * 
 */

class GraphicSelectionManager extends EventEmitter {
  constructor({
    view: _view,
    layers: _layers,
    graphicComparator = (g1, g2) => g1 === g2
  }) {
    super();

    _defineProperty(this, "_selectionChangeHandler", ({
      selection,
      added,
      removed
    }) => {
      const {
        view,
        layers
      } = this;
      layers.forEach((layer, index) => {
        this.highlights[index] && this.highlights[index].remove();
        view.whenLayerView(layer).then(layerView => {
          this.highlights[index] = layerView.highlight(selection.filter(s => s.layer === layer));
        });
      });
      this.emit('selectionChange', {
        selection,
        added,
        removed
      });
    });

    this.view = _view; // map view

    this.layers = _layers || [];
    this.highlights = []; // each layer would have a highlight

    this.selectionManager = new SelectionManager({
      comparator: graphicComparator
    });

    this._init();
  }

  _init() {
    // inside of a specified selector, like PointerSelector, would operate selectionManager, which will emit events
    this.selectionManager.on('selectionChange', this._selectionChangeHandler);
  }

  addLayer(layer) {
    if (this.layers.indexOf(layer) === -1) {
      this.layers.push(layer);
    }
  }

  removeLayer(layer) {
    const index = this.layers.indexOf(layer);

    if (index > -1) {
      this.layers = this.layers.filter((_, i) => i !== index);
      this.highlights = this.highlights.filter((_, i) => i !== index);
    }
  }

  activate({
    type = SELECTOR_TYPE.POINTER,
    multiSelect = true
  }) {
    this.deactivate();

    if (type === SELECTOR_TYPE.POINTER) {
      this.selector = new PointerSelector(this);
    } else if (type === SELECTOR_TYPE.BOX) {// TODO 
    }

    this.selectionManager.mode(multiSelect ? SelectionManager.MODE.MULTIPLE : SelectionManager.MODE.SINGLE);
    this.selector.activate();
  }

  deactivate() {
    if (this.selector) {
      this.selector.deactivate();
      this.selector.destroy();
      this.selector = null;
    }
  }

  destroy() {
    this.deactivate();
    this.selectionManager.removeListener('selectionChange', this._selectionChangeHandler);
  }

}

export default GraphicSelectionManager;