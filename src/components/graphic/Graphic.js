import { Component } from 'react'
import PropTypes from 'prop-types'
import { loadModules } from 'esri-module-loader'

const createGraphic = ({ graphicProperties, geometryJson }) => {
  return loadModules([
    'esri/Graphic'
  ]).then(({ Graphic }) => {
    let graphic
    if (geometryJson) {
      graphic = Graphic.fromJSON(geometryJson)
    } else if (graphicProperties) {
      graphic = new Graphic(graphicProperties)
    } else {
      throw new Error('geometryJson and graphicProperties cannot to be empty at the same time')
    }
    return graphic
  })
}

/**
 * usage:
 *  <GraphicsLayer>
      <Graphic key="" geometryJson={} />
      <Graphic key="" graphicProperties={} />
    </GraphicsLayer>
 */
class Graphic extends Component {
  constructor (props) {
    super(props)
    // because of componentDidUpdate() won't be triggered for the initial rendering
    // so set graphic as state will solve this problem, once graphic is created and setState, component will trigger componentDidUpdate() automatically
    // otherwise, hightlight logic needs to be there in componentWillMount() for one more time
    this.state = {
      graphic: null
    }
  }

  componentWillMount () {
    // load and add to graphicsLayer/featureLayer
    const { graphicProperties, geometryJson } = this.props
    createGraphic({
      graphicProperties, geometryJson
    }).then(graphic => {
      this.add(graphic)
      this.setState({ graphic })
    })
  }

  componentWillUnmount () {
    this.remove(this.state.graphic)
  }

  componentDidUpdate (prevProps) {
    const { graphicProperties: prevGraphicProperties, geometryJson: prevGeometryJson } = prevProps
    const { graphicProperties, geometryJson } = this.props

    if (
      prevGraphicProperties !== graphicProperties ||
      prevGeometryJson !== geometryJson
    ) {
      createGraphic({
        graphicProperties, geometryJson
      }).then(graphic => {
        this.update(graphic)
      })
    }
  }

  add (graphic) {
    const { layer } = this.props
    if (layer.type === 'graphics') {
      layer.add(graphic)  
    } else if (layer.type === 'feature') {
      layer.applyEdits({
        addFeatures: [graphic]
      })
    }
  }

  remove (graphic) {
    const { layer } = this.props
    if (layer.type === 'graphics') {
      layer.remove(graphic)
    } else if (layer.type === 'feature') {
      layer.applyEdits({
        deleteFeatures: [graphic]
      })
    }
  }

  update (graphic) {
    const { layer } = this.props
    if (layer.type === 'graphics') {
      // find by key
      // remove old one
      // add new one
    } else if (layer.type === 'feature') {
      layer.applyEdits({
        updateFeatures: [graphic]
      })
    }
  }

  render () {
    return null
  }
}

Graphic.propTypes = {
  geometryJson: PropTypes.object,
  graphicProperties: PropTypes.object // if geometryJson passed, graphicProperties will be ignored
}

Graphic.defaultProps = {
  geometryJson: null,
  graphicProperties: null
}

export default Graphic