import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import * as geometryUtils from '../../utils/geometry'
import { loadModules } from 'esri-module-loader'

export const extentToGraphic = (mapView, graphic) => {
  if (geometryUtils.type(graphic.geometry) === 'point') {
    mapView.center = graphic.geometry
    mapView.zoom = 13
  } else {
    mapView.extent = graphic.geometry.extent
  }
}

class GraphicLocator extends Component {
  locate () {
    const { view, graphic, geometryJson, onLocate } = this.props
    if (graphic) {
      extentToGraphic(view, graphic)
      onLocate()
    } else {
      loadModules('esri/Graphic').then(Graphic => {
        const graphic = Graphic.fromJSON(geometryJson)
        extentToGraphic(view, graphic)
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
  geometryJson: PropTypes.object,
  onLocate: PropTypes.func,
  doubleClick: PropTypes.bool // use doubleClick to trigger locate
}

GraphicLocator.defaultProps = {
  doubleClick: false,
  onLocate: () => {}
}

export default GraphicLocator