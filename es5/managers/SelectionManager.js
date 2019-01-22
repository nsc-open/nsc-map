import differenceWith from 'lodash.differenceWith';
import EventEmitter from 'eventemitter3';
/**
 * handle the selection math of a collection
 */

const MODE = {
  SINGLE: 'single',
  MULTIPLE: 'multiple'
};

const DEFAULT_COMPARATOR = (a, b) => a === b;

class SelectionManager extends EventEmitter {
  constructor(options) {
    this.comparator = options && options.comparator ? options.comparator : DEFAULT_COMPARATOR;
    this.selectionMode = MODE.SINGLE;
    this.selection = [];
  }
  /**
   * set or get selection mode
   * @param {String} value 
   */


  mode(value) {
    if (!value) {
      return this.selectionMode;
    } else {
      this.selectionMode = value;
    }
  }
  /**
   * clear selection
   */


  clear() {}
  /**
   * add selection
   */


  add(selection) {}
  /**
   * toggle selection
   */


  toggle(selection) {}
  /**
   * remove selection
   */


  remove(selection) {}

}

SelectionManager.MODE = MODE;
export default SelectionManager;