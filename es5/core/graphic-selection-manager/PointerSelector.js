function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import BaseSelector from './BaseSelector';
import { SELECTOR_TYPE } from './constants';
import SelectionManager from '../SelectionManager';
var MODE = SelectionManager.MODE;
/**
 * bind events and select graphics via selectionManager
 * highlight logic will be handled by GraphicSelectionManager
 */

var PointerSelector =
/*#__PURE__*/
function (_BaseSelector) {
  _inherits(PointerSelector, _BaseSelector);

  function PointerSelector(args) {
    var _this;

    _classCallCheck(this, PointerSelector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PointerSelector).call(this, args));
    _this.type = SELECTOR_TYPE.POINTER;
    _this._multipleMode = false;
    _this._eventHandlers = [];
    return _this;
  }

  _createClass(PointerSelector, [{
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this2 = this;

      var _this$gsm = this.gsm,
          view = _this$gsm.view,
          layers = _this$gsm.layers,
          selectionManager = _this$gsm.selectionManager;

      this._eventHandlers.push(view.on('click', function (e) {
        view.hitTest(e).then(function (_ref) {
          var results = _ref.results;
          var selectedGraphics = results.filter(function (r) {
            return layers.includes(r.graphic.layer);
          }).map(function (r) {
            return r.graphic;
          });

          if (_this2._multipleMode && selectionManager.mode() === MODE.MULTIPLE) {
            selectedGraphics.forEach(function (graphic) {
              if (selectionManager.includes(graphic)) {
                selectionManager.remove(graphic);
              } else {
                selectionManager.add(graphic);
              }
            });
          } else {
            selectionManager.select(selectedGraphics);
          }
        });
      }), view.on('key-down', function (e) {
        if (e.key === 'Control') {
          // start multiple selection
          _this2._multipleMode = true;
        }
      }), view.on('key-up', function (e) {
        if (e.key === 'Control') {
          // end multiple selection
          _this2._multipleMode = false;
        }
      }));
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      this._eventHandlers.forEach(function (h) {
        return h.remove();
      });
    }
  }, {
    key: "activate",
    value: function activate() {
      this._bindEvents();
    }
  }, {
    key: "deactivate",
    value: function deactivate() {
      this._unbindEvents();
    }
  }]);

  return PointerSelector;
}(BaseSelector);

export default PointerSelector;