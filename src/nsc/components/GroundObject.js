import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Graphic from '../../esri/components/graphic/Graphic'

/**
 * GroundObject is a wrapper component of Graphic
 * it accepts geometryJson and bizData
 */
const GroundObject = props => {
  const { geometryJson, bizData, attributesMapper, ...restProps } = props

  if (geometryJson) {
    geometryJson.attributes = attributesMapper(bizData, geometryJson.attributes)
    return <Graphic {...restProps} geometryJson={geometryJson} />
  } else {
    return null
  }
}

GroundObject.propTypes = {
  geometryJson: PropTypes.object,
  bizData: PropTypes.object,
  attributesMapper: PropTypes.func
}

GroundObject.defaultProps = {
  geometryJson: undefined,
  bizData: {},
  attributesMapper: (bizData, attributes) => attributes // TODO 其实可以不需要，直接在 使用 GroundObject 时，拿个 mapper 做转换然后传 props 就好了
}

export default GroundObject