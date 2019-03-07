import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { loadModules } from 'esri-module-loader'
import { addKey } from './utils'

/**
 * usage:
 *  <FeatureLayer featureLayerProperties={}>
 *    <Graphic />
 *    <Graphic />
 *  </FeatureLayer>
 */
class FeatureLayer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layer: null, // need to put layer as state, so once layer is created, render would run again
    }
  }

  componentWillMount () {
    loadModules([
      'FeatureLayer'
    ]).then(({ FeatureLayer }) => {
      const { featureLayerProperties, onLoad } = this.props
      const layer = new FeatureLayer(featureLayerProperties)

      this.addLayer(layer)
      this.setState({ layer }) 
      onLoad(layer)
    })
  }

  componentWillUnmount () {
    this.removeLayer(this.state.layer)
  }

  addLayer (layer) {
    const { map, parentLayer } = this.props
    if (parentLayer) {
      console.log('FeatureLayer parentLayer.add(layer)')
      parentLayer.add(layer)
    } else {
      console.log('FeatureLayer map.add(layer)')
      map.add(layer)
    }
  }

  removeLayer (layer) {
    const { map, parentLayer } = this.props
    if (parentLayer) {
      parentLayer.remove(layer)
    } else {
      map.remove(layer)
    }
  }

  render () {
    const { children = [] } = this.props
    const { layer } = this.state

    if (layer) {
      console.log('FeatureLayer render has layer')
      const childProps = { layer } // pass graphicsLayer to direct children
      return Children.map(children, child => {
        // const graphicKey = child.key
        // addKey(child.props, graphicKey)
        return React.cloneElement(child, childProps)
      })
    } else {
      console.log('FeatureLayer render null')
      return null
    }
  }
}

FeatureLayer.propTypes = {
  map: PropTypes.object,
  parentLayer: PropTypes.object,
  featureLayerPropperties: PropTypes.object, // isRequired
  onLoad: PropTypes.func
}

FeatureLayer.defaultProps = {
  map: undefined,
  parentLayer: undefined,
  featureLayerPropperties: undefined,
  onLoad: layer => { console.log('FeatureLayer onLoad') }
}

export default FeatureLayer