import EventEmitter from 'eventemitter3';
/**
 * handle the selection math of a collection
 */

const DEFAULT_COMPARATOR = (a, b) => a === b;

const SELECTION_CHANGE_EVENT = 'selectionChange';
const MODE = {
  SINGLE: 'single',
  MULTIPLE: 'multiple'
};

class SelectionManager extends EventEmitter {
  constructor(options) {
    super();
    this.comparator = options && options.comparator ? options.comparator : DEFAULT_COMPARATOR;
    this.selectionMode = MODE.SINGLE;
    this.selection = [];
  }

  _setSelection({
    selection = [],
    added = [],
    removed = []
  }) {
    this.selection = selection;

    if (added.length > 0 || removed.length > 0) {
      this.emit(SELECTION_CHANGE_EVENT, {
        selection,
        added,
        removed
      });
    }
  }

  _includes(collection, item) {
    return !!collection.find(s => this.comparator(s, item));
  }

  _normalizeSelection(selection) {
    selection = Array.isArray(selection) ? selection : [selection];

    if (this.selectionMode === MODE.SINGLE && selection[0]) {
      selection = [selection[0]];
    }

    return selection;
  }

  mode(value) {
    if (!value) {
      return this.selectionMode;
    } else {
      this.selectionMode = value;

      if (value === MODE.SINGLE && this.selection.length > 1) {
        const [toRemain, ...toRemove] = this.selection;

        this._setSelection({
          selection: [toRemain],
          removed: toRemove
        });
      }
    }
  }

  includes(item) {
    return this._includes(this.selection, item);
  }

  select(selection) {
    selection = this._normalizeSelection(selection || []);
    const toAdd = selection.filter(s => !this._includes(this.selection, s));
    const toRemove = this.selection.filter(s => !this._includes(selection, s));

    this._setSelection({
      selection,
      added: toAdd,
      removed: toRemove
    });
  }

  clear() {
    if (this.selection.length > 0) {
      this._setSelection({
        removed: this.selection
      });
    }
  }

  add(selection) {
    const newSelection = [...this.selection];
    const toAdd = [];

    this._normalizeSelection(selection).forEach(s => {
      if (!this._includes(this.selection, s)) {
        newSelection.push(s);
        toAdd.push(s);
      }
    });

    this._setSelection({
      selection: newSelection,
      added: toAdd
    });
  }

  remove(selection) {
    const toRemove = [];
    const toRemain = [];
    selection = this._normalizeSelection(selection);
    this.selection.forEach(s => {
      if (this._includes(selection, s)) {
        toRemove.push(s);
      } else {
        toRemain.push(s);
      }
    });

    this._setSelection({
      selection: toRemain,
      removed: toRemove
    });
  }

}

SelectionManager.MODE = MODE;
export default SelectionManager;