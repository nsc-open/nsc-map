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
import AngleMeasurement2DViewModel from './AngleMeasurement2DViewModel';
/**
 * Use SketchViewModel to implement this measurement
 * events: ready | update
 */

var AngleMeasurement = /*#__PURE__*/function (_EventEmitter) {
  _inherits(AngleMeasurement, _EventEmitter);

  var _super = _createSuper(AngleMeasurement);

  function AngleMeasurement(_ref) {
    var _this;

    var view = _ref.view;

    _classCallCheck(this, AngleMeasurement);

    _this = _super.call(this);
    _this.destroyed = false;
    _this.viewModel = new AngleMeasurement2DViewModel({
      view: view
    });

    _this.viewModel.newMeasurement();

    return _this;
  }

  _createClass(AngleMeasurement, [{
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
        this.viewModel.destroy();
        this.viewModel = null;
      }

      this.destroyed = true;
    }
  }]);

  return AngleMeasurement;
}(EventEmitter);

export default AngleMeasurement;