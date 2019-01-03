import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import EsriModuleLoader from 'esri-module-loader'
import Graphic from '../Graphic'

/**
 * <GraphicsLayer>
 *  <Graphic selected />
 *  <Graphic />
 * </GraphicsLayer>
 */
class GraphicsLayer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layer: null // need to put layer as state, so once layer is created, render would run again
    }
  }

  componentWillMount () {
    EsriModuleLoader.loadModules([
      'GraphicsLayer'
    ]).then(({ GraphicsLayer }) => {
      const { map } = this.props
      const layer = new GraphicsLayer()
      map.add(layer)
      this.setState({ layer })
    })
  }

  componentWillUnmount () {
    this.props.map.remove(this.state.layer)
  }

  componentDidUpdate () {
    // update graphicsLayer properties
  }

  render () {
    console.log('GraphicsLayer render')
    const { children = [] } = this.props
    const { layer } = this.state

    if (layer) {
      const childProps = { graphicsLayer: layer } // pass graphicsLayer to direct children
      return Children.map(children, child => React.cloneElement(child, childProps))
    } else {
      return null
    }
  }
}

GraphicsLayer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(Graphic),
    PropTypes.instanceOf(Graphic)
  ]),
  graphicsLayerProperties: PropTypes.object.isRequired
}

GraphicsLayer.defaultProps = {
  children: [],
  graphicsLayerProperties: {}
}

export default GraphicsLayer