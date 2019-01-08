import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Graphic from './esri/Graphic'

/**
 * FeatureLayer 中的 label 必须从 graphic.attributes.xx 中去获取
 */
class GroundObject extends Component {
  constructor (props) {
    super(props)
    this.state = {
      layer: null // groundObjectsLayer
    }
  }

  componentWillMount () {
    
  }

  componentWillUnmount () {

  }

  componentDidUpdate () {

  }

  render () {

  }
}

GroundObject.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  geometryJson: PropTypes.object.isRequired,
  bizData: PropTypes.object
}

GroundObject.defaultProps = {
  id: undefined,
  name: undefined,
  geometryJson: undefined,
  data: undefined
}

export default props => {
  console.log('render GroundObject', props)
  return <Graphic {...props} />
}