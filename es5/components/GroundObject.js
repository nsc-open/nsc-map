import React, { Component } from 'react';
import PropTypes from 'prop-types';
/**
 * FeatureLayer 中的 label 必须从 graphic.attributes.xx 中去获取
 */

class GroundObject extends Component {
  componentWillMount() {}

  componentWillUnmount() {}

  componentDidUpdate() {}

  render() {}

}

GroundObject.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  geometryJson: PropTypes.object.isRequired,
  bizData: PropTypes.object.isRequired
};
GroundObject.defaultProps = {
  id: undefined,
  name: undefined,
  geometryJson: undefined,
  data: undefined
};
export default GroundObject;