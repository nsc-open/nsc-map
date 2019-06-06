import { loadModules } from 'esri-module-loader';
import * as geometryUtils from '../../utils/geometry';
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
export var addGraphic = function addGraphic(layer, graphic) {
  if (layer.type === 'graphics') {
    layer.add(graphic);
  } else if (layer.type === 'feature') {
    layer.applyEdits({
      addFeatures: [graphic]
    });
  }
};
export var removeGraphic = function removeGraphic(layer, graphic) {
  if (layer.type === 'graphics') {
    layer.remove(graphic);
  } else if (layer.type === 'feature') {
    layer.applyEdits({
      deleteFeatures: [graphic]
    });
  }
};
export var updateGraphic = function updateGraphic(layer, graphic, properties) {
  graphic.set(properties);

  if (layer.type === 'feature') {
    layer.applyEdits({
      updateFeatures: [graphic]
    });
  }
};
export var replaceGraphic = function replaceGraphic(layer, graphic, oldGraphic) {
  if (layer.type === 'graphics') {
    layer.remove(oldGraphic);
    layer.add(graphic);
  } else if (layer.type === 'feature') {
    layer.applyEdits({
      deleteFeatures: [oldGraphic],
      addFeatures: [graphic]
    });
  }
};
export var createGraphic = function createGraphic(_ref2) {
  var properties = _ref2.properties,
      json = _ref2.json;
  return loadModules(['esri/Graphic']).then(function (_ref3) {
    var Graphic = _ref3.Graphic;

    if (properties) {
      return new Graphic(properties);
    } else if (json) {
      return Graphic.fromJSON(json);
    } else {
      throw new Error('properties and json cannot to be empty at the same time');
    }
  });
};
export var json2Properties = function json2Properties(json) {
  return createGraphic({
    json: json
  }).then(function (_ref4) {
    var attributes = _ref4.attributes,
        geometry = _ref4.geometry,
        symbol = _ref4.symbol;
    return {
      attributes: attributes,
      geometry: geometry,
      symbol: symbol
    };
  });
};