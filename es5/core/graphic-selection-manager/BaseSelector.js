function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BaseSelector = /*#__PURE__*/function () {
  function BaseSelector(graphicSelectionManager) {
    _classCallCheck(this, BaseSelector);

    this.type = 'base';
    this.gsm = graphicSelectionManager;
  }

  _createClass(BaseSelector, [{
    key: "destroy",
    value: function destroy() {}
  }]);

  return BaseSelector;
}();

export default BaseSelector;