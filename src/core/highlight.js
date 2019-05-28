import * as geometryUtils from '../utils/geometry'

/**
 * due to the reason that highlight GraphicsLayer is only support in SceneView.
 *       https://developers.arcgis.com/javascript/latest/api-reference/esri-views-layers-GraphicsLayerView.html#highlight} graphic 
 * 
 * so here gives an common solution for both FeatureLayer and GraphicsLayer
 */
const createHighlightGrpahic = (graphic, { color, fillOpacity, haloOpacity }) => {
  const clone = graphic.clone()  
  const geoType = geometryUtils.type(graphic.geometry)
  switch (geoType) {
    case 'point':
    case 'multipoint':
    case 'polygon':
      color.a = fillOpacity
      clone.symbol.color = color
      clone.symbol.outline && (clone.symbol.outline.color = color)
      break;
    case 'polyline':
      clone.symbol.color = color
      break;
  }
  return clone
}

export const highlight = (layerView, targets = []) => {
  const { layer, view } = layerView
  const isGraphicsLayerView = layer.type === 'graphics'
  if (!isGraphicsLayerView) { // featureLayerView
    return layerView.highlight(targets)
  }

  const { highlightOptions } = view
  const highlightGraphics = targets.map(t => createHighlightGrpahic(t, highlightOptions))

  targets.forEach(t => t.visible = false)
  layer.addMany(highlightGraphics)

  const removeFunc = () => {
    layer.removeMany(highlightGraphics)
    targets.forEach(t => t.visible = true)
  }
  return { remove: removeFunc }
}