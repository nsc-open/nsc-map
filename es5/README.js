/*#__PURE__*/
React.createElement(Map, null, /*#__PURE__*/React.createElement(GroundObjectLayer, null, groundObjects.map(function (data) {
  return /*#__PURE__*/React.createElement(GroundObject, {
    key: data.id,
    geometryJson: data.geometryJson
  });
})), /*#__PURE__*/React.createElement(SketchTools, null), /*#__PURE__*/React.createElement(MeasureTools, null), /*#__PURE__*/React.createElement(DynamicLayerSelector, null), /*#__PURE__*/React.createElement(BaseMapSelector, null));