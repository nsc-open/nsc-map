import * as geometryUtils from './geometry';
/**
 * due to the reason that highlight GraphicsLayer is only support in SceneView.
 *       https://developers.arcgis.com/javascript/latest/api-reference/esri-views-layers-GraphicsLayerView.html#highlight} graphic 
 * 
 * so here gives an common solution for both FeatureLayer and GraphicsLayer
 */

var createHighlightGrpahic = function createHighlightGrpahic(graphic, _ref) {
  var color = _ref.color,
      fillOpacity = _ref.fillOpacity,
      haloOpacity = _ref.haloOpacity;
  var clone = graphic.clone();
  var geoType = geometryUtils.type(graphic.geometry);

  switch (geoType) {
    case 'point':
    case 'multipoint':
    case 'polygon':
      color.a = fillOpacity;
      clone.symbol.color = color;
      clone.symbol.outline && (clone.symbol.outline.color = color);
      break;

    case 'polyline':
      clone.symbol.color = color;
      break;
  }

  return clone;
};

export var highlight = function highlight(layerView) {
  var targets = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var options = arguments.length > 2 ? arguments[2] : undefined;
  var layer = layerView.layer,
      view = layerView.view;
  var isGraphicsLayerView = layer.type === 'graphics';

  if (!isGraphicsLayerView) {
    // featureLayerView
    return layerView.highlight(targets);
  }

  var mode = options && options.mode || 'symbol'; // visibiliy | symbol

  var highlightOptions = view.highlightOptions;
  var highlightGraphics = targets.map(function (t) {
    return createHighlightGrpahic(t, highlightOptions);
  });

  if (mode === 'symbol') {
    var originSymbolMapping = {};
    targets.forEach(function (t, i) {
      originSymbolMapping[i] = t.clone().symbol;
      t.symbol = highlightGraphics[i].symbol;
    });
    return {
      remove: function remove() {
        targets.forEach(function (t, i) {
          t.symbol = originSymbolMapping[i];
        });
      }
    };
  } else {
    targets.forEach(function (t) {
      return t.visible = false;
    });
    layer.addMany(highlightGraphics);
    return {
      remove: function remove() {
        layer.removeMany(highlightGraphics);
        targets.forEach(function (t) {
          return t.visible = true;
        });
      }
    };
  }
};