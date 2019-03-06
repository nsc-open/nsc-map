function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * usage:
 *    import { createNamespace } from 'InstanceManager'
 *    const mapNS = createNamespace('map')
 *    mapNS.register('a-map')
 *    mapNS.get('a-map').then(mapInstance => {})
 *    mapNS.set('a-map', instance)
 * 
 *    const sketchNS = createNamespace('sketch')
 *    ...
 */
import EventEmitter from 'eventemitter3';

var Namespace =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Namespace, _EventEmitter);

  function Namespace() {
    var _this;

    _classCallCheck(this, Namespace);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Namespace).call(this));
    _this.instances = {};
    return _this;
  }

  _createClass(Namespace, [{
    key: "register",
    value: function register(id) {
      if (this.instances[id]) {
        console.warn("instance of id '".concat(id, "' exists, this will make it overrided"));
      }

      this.instances[id] = {
        instance: null
      };
    }
  }, {
    key: "unregister",
    value: function unregister(id) {
      if (this.instances[id]) {
        this.instances[id] = null;
        this.emit("".concat(id, "-unregister"));
      }
    }
  }, {
    key: "set",
    value: function set(id, instance) {
      if (!this.instances[id]) {
        console.error("instance of id '".concat(id, "' is not registered, please register it first"));
        return;
      }

      this.instances[id].instance = instance;
      this.emit("".concat(id, "-ready"), instance);
    }
  }, {
    key: "get",
    value: function get(id) {
      var _this2 = this;

      if (!this.instances[id]) {
        console.error("instance of id '".concat(id, "' is not registered"));
        return;
      }

      if (this.instances[id].instance) {
        return Promise.resolve(this.instances[id].instance);
      } else {
        return new Promise(function (resolve, reject) {
          _this2.once("".concat(id, "-ready"), resolve);

          _this2.once("".concat(id, "-unregister"), reject);

          _this2.once("".concat(id, "-destroy"), reject);
        });
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this3 = this;

      Object.keys(this.instances).forEach(function (id) {
        if (_this3.instances[id]) {
          _this3.emit("".concat(id, "-destroy"));
        }
      });
      this.instances = {};
    }
  }]);

  return Namespace;
}(EventEmitter);

var NAMESPACES = {};
export var createNamespace = function createNamespace(key) {
  if (NAMESPACES[key]) {
    console.warn("namespace[".concat(key, "] is already there, this will make it overrided"));
  }

  return NAMESPACES[key] = new Namespace();
};
export var deleteNamespace = function deleteNamespace(key) {
  if (NAMESPACES[key]) {
    NAMESPACES[key].destroy();
    NAMESPACES[key] = null;
  }
};
export var getNamespace = function getNamespace(key) {
  return NAMESPACES[key];
};