React.createElement(Map, null, React.createElement(GroundObjectLayer, null, groundObjects.map(function (data) {
  return React.createElement(GroundObject, {
    key: data.id,
    geometryJson: data.geometryJson
  });
})), React.createElement(SketchTools, null), React.createElement(MeasureTools, null), React.createElement(DynamicLayerSelector, null), React.createElement(BaseMapSelector, null));