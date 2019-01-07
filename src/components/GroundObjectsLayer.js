import React, { Component } from 'react'
import PropTypes from 'prop-types'
import EsriModuleLoader from 'esri-module-loader'
import GroupLayer from './esri/layers/GroupLayer'
import FeatureLayer from './esri/layers/FeatureLayer'

// is a combination of GraphicsLayer and Annotation Layer
/**
 * <GroundObjectsLayer>
 *  <GroundObject />
 *  <GroundObject />
 * </GroundObjectsLayer>
 */
class GroundObjectsLayer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      groupLayer: null,
      pointsFeatureLayer: null,
      linesFeatureLayer: null,
      polygonsFeatureLayer: null
    }
  }

  componentWillMount () {
    EsriModuleLoader.loadModules([
      'esri/layers/FeatureLayer',
      'esri/layers/GroupLayer'
    ]).then(({ FeatureLayer, GroupLayer }) => {
      const { map } = this.props
      const pointsFeatureLayer = new FeatureLayer()
      const linesFeatureLayer = new FeatureLayer()
      const polygonsFeatureLayer = new FeatureLayer()
      const groupLayer = new GroupLayer({
        layers: [polygonsFeatureLayer, linesFeatureLayer, pointsFeatureLayer]
      })
      
      map.add(groupLayer)

      this.setState({
        groupLayer,
        pointsFeatureLayer,
        linesFeatureLayer,
        polygonsFeatureLayer
      })
    })
  }

  componentWillUnmount () {
    this.props.map.remove(this.state.groupLayer)
  }

  add () {

  }

  remove () {

  }

  update () {

  }

  render () {
    console.log('GroundObjectsLayer render', this.props)
    const { children, map } = this.props
    if (!map) {
      return null
    }

    return (
      <GroupLayer map={map}>
        <FeatureLayer key="polygonsFeatureLayer"></FeatureLayer>
        <FeatureLayer key="linesFeatureLayer"></FeatureLayer>
        <FeatureLayer key="pointsFeatureLayer"></FeatureLayer>
      </GroupLayer>
    )
  }
}

GroundObjectsLayer.propTypes = {
  map: PropTypes.object,
}

GroundObjectsLayer.defaultProps = {
  map: null
}

export default GroundObjectsLayer