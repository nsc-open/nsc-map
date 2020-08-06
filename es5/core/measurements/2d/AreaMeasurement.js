function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import EventEmitter from 'eventemitter3';
import { loadModules } from 'esri-module-loader';
/**
 * Use AreaMeasurement2DViewModel
 * TODO: XXViewModel 的重复实例化会导致地图上反复添加新的 graphicsLayer
 * 
 * events: ready | update
 * 
 */

var AreaMeasurement = /*#__PURE__*/function (_EventEmitter) {
  _inherits(AreaMeasurement, _EventEmitter);

  var _super = _createSuper(AreaMeasurement);

  function AreaMeasurement(_ref) {
    var _this;

    var view = _ref.view;

    _classCallCheck(this, AreaMeasurement);

    _this = _super.call(this);
    _this.viewModel = null;
    _this.destroyed = false;
    loadModules(['esri/widgets/AreaMeasurement2D/AreaMeasurement2DViewModel']).then(function (_ref2) {
      var AreaMeasurement2DViewModel = _ref2.AreaMeasurement2DViewModel;

      if (_this.destroyed) {
        return;
      }

      _this.viewModel = new AreaMeasurement2DViewModel({
        view: view,
        mode: 'planar',
        unit: 'square-kilometers'
      });

      _this.viewModel.watch('measurementLabel', function () {
        if (!_this.viewModel || !_this.viewModel.measurement) {
          // this.destroy() will trigger this watch, and this.viewModel is null then
          return;
        }

        var _this$viewModel = _this.viewModel,
            unit = _this$viewModel.unit,
            measurement = _this$viewModel.measurement;
        var area = measurement.area;

        _this.emit('update', {
          area: area,
          unit: unit
        });
      });

      _this.newMeasurement();

      _this.emit('ready');
    });
    return _this;
  }

  _createClass(AreaMeasurement, [{
    key: "newMeasurement",
    value: function newMeasurement() {
      this.viewModel.newMeasurement();
    }
  }, {
    key: "clearMeasurement",
    value: function clearMeasurement() {
      this.viewModel && this.viewModel.clearMeasurement();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.viewModel) {
        this.clearMeasurement(); // the DistanceMeasurement2DViewModel doesn't provide a nice destory function
        // so needs to do it myself

        this.viewModel.tool.destroy();
        this.viewModel.view.cursor = 'default';
        this.viewModel = null;
      }

      this.destroyed = true;
    }
  }]);

  return AreaMeasurement;
}(EventEmitter);

export default AreaMeasurement;