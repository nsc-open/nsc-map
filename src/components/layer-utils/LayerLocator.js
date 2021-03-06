import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'

const extentToLayer = (mapView, layerId) => {
  const layer = mapView.map.findLayerById(layerId)
  layer && (mapView.extent = layer.fullExtent)
}

/**
 * LayerLocator
 * 
 * usage:
 *    <LayerLocator layerId="" map view>
 *      <Button>Click Me to locate the layer</Button>
 *    </LayerLocator>
 */
class LayerLocator extends Component {
  locate () {
    const { view, layerId, onLocate } = this.props
    extentToLayer(view, layerId)
    onLocate()
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

LayerLocator.propTypes = {
  map: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  onLocate: PropTypes.func,
  layerId: PropTypes.string.isRequired,
  doubleClick: PropTypes.bool // use doubleClick to trigger locate
}

LayerLocator.defaultProps = {
  map: undefined,
  view: undefined,
  onLocate: () => {},
  doubleClick: false,
  layerId: undefined
}

export default LayerLocator