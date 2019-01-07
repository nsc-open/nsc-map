import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import EsriModuleLoader from 'esri-module-loader'

class GroupLayer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      layer: null
    }
  }

  componentWillMount () {
    EsriModuleLoader.loadModules([
      'esri/layers/GroupLayer'
    ]).then(({ GroupLayer }) => {
      const { map } = this.props
      const layer = new GroupLayer()
      map.add(layer)
      console.log('GroupLayer map.add(layer)')
      this.setState({ layer })
    })
  }

  componentWillUnmount () {
    this.props.map.remove(this.state.layer)
  }


  render () {
    const { children, map, view } = this.props
    const { layer } = this.state

    if (layer) {
      console.log('GroupLayer render')
      return Children.map(children, child => {
        return React.cloneElement(child, {
          map,
          view,
          parentLayer: layer,
          ...child.props,
        })
      })
    } else {
      console.log('GroupLayer render null', this.props)
      return null
    }
  }
}

GroupLayer.propTypes = {
  map: PropTypes.object.isRequired
}

GroupLayer.defaultTypes = {
  map: undefined
}

export default GroupLayer