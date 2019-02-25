import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { loadModules } from 'esri-module-loader'

class GroupLayer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      layer: null
    }
  }

  componentWillMount () {
    console.log('GroupLayer willmount')
    loadModules([
      'esri/layers/GroupLayer'
    ]).then(({ GroupLayer }) => {
      const { map, onLoad } = this.props
      console.log(onLoad)
      const layer = new GroupLayer()
      map.add(layer)
      console.log('GroupLayer map.add(layer)')
      this.setState({ layer })

      onLoad(layer)
    })
  }

  componentWillUnmount () {
    this.props.map.remove(this.state.layer)
  }

  render () {
    const { children, map, view } = this.props
    const { layer } = this.state

    if (layer && children) {
      console.log('GroupLayer render')
      return Children.map(children, child => {
        const childProps = { ...child.props, map, view, parentLayer: layer }
        return React.cloneElement(child, childProps)
      })
    } else {
      console.log('GroupLayer render null', this.props)
      return null
    }
  }
}

GroupLayer.propTypes = {
  map: PropTypes.object,
  view: PropTypes.object,
  onLoad: PropTypes.func
}

GroupLayer.defaultProps = {
  map: undefined,
  view: undefined,
  onLoad: layer => { console.log('GroupLayer onLoad') }
}

export default GroupLayer