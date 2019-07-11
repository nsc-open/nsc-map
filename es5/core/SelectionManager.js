function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import EventEmitter from 'eventemitter3';
/**
 * handle the selection math of a collection
 */

var DEFAULT_COMPARATOR = function DEFAULT_COMPARATOR(a, b) {
  return a === b;
};

var SELECTION_CHANGE_EVENT = 'selectionChange';
var MODE = {
  SINGLE: 'single',
  MULTIPLE: 'multiple'
};

var SelectionManager =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(SelectionManager, _EventEmitter);

  function SelectionManager(options) {
    var _this;

    _classCallCheck(this, SelectionManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SelectionManager).call(this));
    _this.comparator = options && options.comparator ? options.comparator : DEFAULT_COMPARATOR;
    _this.selectionMode = MODE.SINGLE;
    _this.selection = [];
    return _this;
  }

  _createClass(SelectionManager, [{
    key: "_setSelection",
    value: function _setSelection(_ref, meta) {
      var _ref$selection = _ref.selection,
          selection = _ref$selection === void 0 ? [] : _ref$selection,
          _ref$added = _ref.added,
          added = _ref$added === void 0 ? [] : _ref$added,
          _ref$removed = _ref.removed,
          removed = _ref$removed === void 0 ? [] : _ref$removed;
      this.selection = selection;

      if (added.length > 0 || removed.length > 0) {
        this.emit(SELECTION_CHANGE_EVENT, {
          selection: selection,
          added: added,
          removed: removed,
          meta: meta
        });
      }
    }
  }, {
    key: "_includes",
    value: function _includes(collection, item) {
      var _this2 = this;

      return !!collection.find(function (s) {
        return _this2.comparator(s, item);
      });
    }
  }, {
    key: "_normalizeSelection",
    value: function _normalizeSelection(selection) {
      selection = Array.isArray(selection) ? selection : [selection];

      if (this.selectionMode === MODE.SINGLE && selection[0]) {
        selection = [selection[0]];
      }

      return selection;
    }
  }, {
    key: "mode",
    value: function mode(value) {
      if (!value) {
        return this.selectionMode;
      } else {
        this.selectionMode = value;

        if (value === MODE.SINGLE && this.selection.length > 1) {
          var _this$selection = _toArray(this.selection),
              toRemain = _this$selection[0],
              toRemove = _this$selection.slice(1);

          this._setSelection({
            selection: [toRemain],
            removed: toRemove
          });
        }
      }
    }
  }, {
    key: "includes",
    value: function includes(item) {
      return this._includes(this.selection, item);
    }
  }, {
    key: "select",
    value: function select(selection, meta) {
      var _this3 = this;

      selection = this._normalizeSelection(selection || []);
      var toAdd = selection.filter(function (s) {
        return !_this3._includes(_this3.selection, s);
      });
      var toRemove = this.selection.filter(function (s) {
        return !_this3._includes(selection, s);
      });

      this._setSelection({
        selection: selection,
        added: toAdd,
        removed: toRemove
      }, meta);
    }
  }, {
    key: "clear",
    value: function clear() {
      if (this.selection.length > 0) {
        this._setSelection({
          removed: this.selection
        });
      }
    }
  }, {
    key: "add",
    value: function add(selection, meta) {
      var _this4 = this;

      var newSelection = _toConsumableArray(this.selection);

      var toAdd = [];

      this._normalizeSelection(selection).forEach(function (s) {
        if (!_this4._includes(_this4.selection, s)) {
          newSelection.push(s);
          toAdd.push(s);
        }
      });

      this._setSelection({
        selection: newSelection,
        added: toAdd
      }, meta);
    }
  }, {
    key: "remove",
    value: function remove(selection, meta) {
      var _this5 = this;

      var toRemove = [];
      var toRemain = [];
      selection = this._normalizeSelection(selection);
      this.selection.forEach(function (s) {
        if (_this5._includes(selection, s)) {
          toRemove.push(s);
        } else {
          toRemain.push(s);
        }
      });

      this._setSelection({
        selection: toRemain,
        removed: toRemove
      }, meta);
    }
  }]);

  return SelectionManager;
}(EventEmitter);

SelectionManager.MODE = MODE;
export default SelectionManager;