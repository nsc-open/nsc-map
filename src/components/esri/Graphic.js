import { Component } from 'react'
import PropTypes from 'prop-types'
import EsriModuleLoader from 'esri-module-loader'
import { HIGHLIGHT_SYMBOLS } from '../../constants/symbols'

/*
<GraphicsLayer>
  <Graphic selected highlightSymbol={} />
  <Graphic />
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
    this.originalSymbol = null
  }

  componentWillMount () {
    // load and add to graphicsLayer
    EsriModuleLoader.loadModules([
      'esri/Graphic'
    ]).then(({ Graphic }) => {
      const { graphicProperties, geometryJson } = this.props
      let graphic

      if (geometryJson) {
        graphic = Graphic.fromJSON(geometryJson)
      } else if (graphicProperties) {
        graphic = new Graphic(graphicProperties)
      } else {
        throw new Error('geometryJson and graphicProperties cannot to be empty at the same time')
      }

      this.props.graphicsLayer.add(graphic)
      this.setState({ graphic })
    })
  }

  componentWillUnmount () {
    this.props.graphicsLayer.remove(this.state.graphic)
  }

  componentDidUpdate (prevProps) {
    const { selected, graphicProperties } = this.props
    const { graphic } = this.state

    if (graphicProperties !== prevProps.graphicProperties) {
      graphic.set(graphicProperties)
    }

    if (selected) {
      this.highlight()
    } else {
      this.clearHighlight()
    }
  }

  highlight () {
    const { highlightSymbol } = this.props
    const { graphic } = this.state

    if (this.originalSymbol) { // already highlighted
      return
    }

    this.originalSymbol = graphic.symbol
    graphic.symbol = highlightSymbol || HIGHLIGHT_SYMBOLS[graphic.geometry.type]
  }

  clearHighlight () {
    const { graphic } = this.state
    graphic.symbol = this.originalSymbol
    this.originalSymbol = null
  }

  render () {
    console.log('Graphic render')
    return null
  }
}

Graphic.propTypes = {
  selected: PropTypes.bool,
  highlightSymbol: PropTypes.object,
  geometryJson: PropTypes.object,     // geometryJson will only be handled for the initial rendering
  graphicProperties: PropTypes.object // if geometryJson passed, graphicProperties will be ignored
}

Graphic.defaultProps = {
  selected: false,
  highlightSymbol: null,
  geometryJson: null,
  graphicProperties: null
}

export default Graphic
