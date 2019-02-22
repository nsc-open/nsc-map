import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import MapInstanceManager from '@/lib/map/managers/InstanceManager'
import { loadModules } from 'esri-module-loader'

export const extentToGraphic = (map, graphic) => {
  return loadModules(
    [{ name: 'graphicsUtils', path: 'esri/graphicsUtils' }]
  ).then(({ graphicsUtils }) => {
    if (graphic.geometry.type === 'point') {
      mapView.center = graphic.geometry
      mapView.zoom = 13
    } else {
      // const extent = graphicsUtils.graphicsExtent([graphic])
      // mapView.extent = extent
    }
  })
}

class GraphicLocator extends Component {
  locate () {
    const { mapId, graphic, onLocate } = this.props
    MapInstanceManager.get(mapId)
      .then(map => extentToGraphic(map, graphic))
      .then(() => onLocate)
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
  doubleClick: PropTypes.bool // use doubleClick to trigger locate
}

GraphicLocator.defaultProps = {
  doubleClick: false
}