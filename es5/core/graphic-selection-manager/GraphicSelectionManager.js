function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import EventEmitter from 'eventemitter3';
import SelectionManager from '../SelectionManager';
import PointerSelector from './PointerSelector';
import { SELECTOR_TYPE } from './constants';
/**
 * This support graphics selection and highlight from multiple layers (graphicsLayer or featureLayer)
 * NOTE: highlight GraphicsLayer is only support in SceneView.
 *       https://developers.arcgis.com/javascript/latest/api-reference/esri-views-layers-GraphicsLayerView.html#highlight
 * 
 * usage:
 *   const gsm = new GraphicSelectionManager({ view, layers: [graphicsLayer1, graphicsLayer2, featureLayer, ...] })
 *   gms.activate({ tool: 'pointer', multiSelect: true })
 *   gms.on('selectionChange', data => {})
 */

var GraphicSelectionManager =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(GraphicSelectionManager, _EventEmitter);

  function GraphicSelectionManager(_ref) {
    var _this;

    var view = _ref.view,
        layers = _ref.layers,
        _ref$graphicComparato = _ref.graphicComparator,
        graphicComparator = _ref$graphicComparato === void 0 ? function (g1, g2) {
      return g1 === g2;
    } : _ref$graphicComparato;

    _classCallCheck(this, GraphicSelectionManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GraphicSelectionManager).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_selectionChangeHandler", function (_ref2) {
      var selection = _ref2.selection,
          added = _ref2.added,
          removed = _ref2.removed;

      _this.highlight(selection);

      _this.emit('selectionChange', {
        selection: selection,
        added: added,
        removed: removed
      });
    });

    if (!view) {
      throw new Error('view is required');
    }

    _this.view = view; // map view

    _this.layers = layers || [];
    _this.highlights = []; // each layer would have a highlight

    _this.selectionManager = new SelectionManager({
      comparator: graphicComparator
    });

    _this._init();

    return _this;
  }

  _createClass(GraphicSelectionManager, [{
    key: "_init",
    value: function _init() {
      // inside of a specified selector, like PointerSelector, would operate selectionManager, which will emit events
      this.selectionManager.on('selectionChange', this._selectionChangeHandler);
    }
  }, {
    key: "highlight",
    value: function highlight() {
      var _this2 = this;

      var selection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var view = this.view,
          layers = this.layers;
      layers.forEach(function (layer, index) {
        _this2.highlights[index] && _this2.highlights[index].remove();
        view.whenLayerView(layer).then(function (layerView) {
          _this2.highlights[index] = layerView.highlight(selection.filter(function (s) {
            return s.layer === layer;
          }));
        });
      });
    }
  }, {
    key: "addLayer",
    value: function addLayer(layer) {
      if (this.layers.indexOf(layer) === -1) {
        this.layers.push(layer);
      }
    }
  }, {
    key: "removeLayer",
    value: function removeLayer(layer) {
      var index = this.layers.indexOf(layer);

      if (index > -1) {
        this.layers = this.layers.filter(function (_, i) {
          return i !== index;
        });
        this.highlights = this.highlights.filter(function (_, i) {
          return i !== index;
        });
      }
    }
  }, {
    key: "activate",
    value: function activate(_ref3) {
      var _ref3$type = _ref3.type,
          type = _ref3$type === void 0 ? SELECTOR_TYPE.POINTER : _ref3$type,
          _ref3$multiSelect = _ref3.multiSelect,
          multiSelect = _ref3$multiSelect === void 0 ? false : _ref3$multiSelect;
      this.deactivate();

      if (type === SELECTOR_TYPE.POINTER) {
        this.selector = new PointerSelector(this);
      } else if (type === SELECTOR_TYPE.BOX) {// TODO 
      }

      this.selectionManager.mode(multiSelect ? SelectionManager.MODE.MULTIPLE : SelectionManager.MODE.SINGLE);
      this.selector.activate();
    }
  }, {
    key: "deactivate",
    value: function deactivate() {
      if (this.selector) {
        this.selector.deactivate();
        this.selector.destroy();
        this.selector = null;
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.deactivate();
      this.selectionManager.removeListener('selectionChange', this._selectionChangeHandler);
      this.highlights.forEach(function (h) {
        return h && h.remove();
      });
      this.highlights = [];
    }
  }]);

  return GraphicSelectionManager;
}(EventEmitter);

export default GraphicSelectionManager;