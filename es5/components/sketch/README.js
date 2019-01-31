React.createElement(Map, null, React.createElement(GroundObjectLayer, null, groundObjects.map(data => React.createElement(GroundObject, {
  key: data.id,
  geometryJson: data.geometryJson
}))));