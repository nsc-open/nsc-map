function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graphic from './graphic/Graphic';
/**
 * GroundObject is a wrapper component of Graphic
 * it accepts geometryJson and bizData
 */

var GroundObject = function GroundObject(props) {
  var geometryJson = props.geometryJson,
      bizData = props.bizData,
      attributesMapper = props.attributesMapper,
      restProps = _objectWithoutProperties(props, ["geometryJson", "bizData", "attributesMapper"]);

  if (geometryJson) {
    geometryJson.attributes = attributesMapper(bizData, geometryJson.attributes);
    return React.createElement(Graphic, _extends({}, restProps, {
      geometryJson: geometryJson
    }));
  } else {
    return null;
  }
};

GroundObject.propTypes = {
  geometryJson: PropTypes.object,
  bizData: PropTypes.object,
  attributesMapper: PropTypes.func
};
GroundObject.defaultProps = {
  geometryJson: undefined,
  bizData: {},
  attributesMapper: function attributesMapper(bizData, attributes) {
    return attributes;
  } // TODO 其实可以不需要，直接在 使用 GroundObject 时，拿个 mapper 做转换然后传 props 就好了

};
export default GroundObject;