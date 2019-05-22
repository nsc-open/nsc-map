import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import * as geometryUtils from '../../utils/geometry'
import { loadModules } from 'esri-module-loader'

export const extentToGraphic = (mapView, graphic, pointZoomValue) => {
  if (geometryUtils.type(graphic.geometry) === 'point') {
    mapView.center = graphic.geometry
    mapView.zoom = pointZoomValue
  } else {
    mapView.extent = graphic.geometry.extent
  }
}

class GraphicLocator extends Component {
  locate () {
    const { view, graphic, geometryJson, onLocate, pointZoomValue } = this.props
    if (graphic) {
      extentToGraphic(view, graphic, pointZoomValue)
      onLocate()
    } else {
      loadModules([
        'esri/Graphic',
        'esri/geometry/geometryEngine'
      ]).then(({ Graphic, geometryEngine }) => {
        if (Array.isArray(geometryJson)) {
          const unionGeometry = geometryEngine.union(geometryJson.map(json => Graphic.fromJSON(json).geometry))
          view.extent = unionGeometry.extent
        } else {
          const graphic = Graphic.fromJSON(geometryJson)
          extentToGraphic(view, graphic, pointZoomValue)
        }
        onLocate()
      })
    }
  }

  doubleClickHandler = () => {
    if (this.props.doubleClick) {
      this.locate()
    }
  }

  clickHandler = () => {
    if (!this.props.doubleClick) {
      this.locate()
    }
  }

  render () {
    const { children } = this.props
    return (
      <span onClick={this.clickHandler} onDoubleClick={this.doubleClickHandler}>
        {children ? children : <Button size="small" icon="environment-o" />}
      </span>
    )
  }
}

GraphicLocator.propTypes = {
  map: PropTypes.object,
  view: PropTypes.object,
  graphic: PropTypes.object,
  geometryJson: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onLocate: PropTypes.func,
  doubleClick: PropTypes.bool, // use doubleClick to trigger locate
  pointZoomValue: PropTypes.number
}

GraphicLocator.defaultProps = {
  doubleClick: false,
  onLocate: () => {},
  pointZoomValue: 13
}

export default GraphicLocator