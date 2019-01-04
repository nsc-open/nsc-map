import { Component } from 'react'
import PropTypes from 'prop-types'
import EsriModuleLoader from 'esri-module-loader'
import { HIGHLIGHT_SYMBOLS } from '../../constants/symbols'

const loadModules = () => EsriModuleLoader.loadModules([
  'esri/Graphic'
])

/**
 * usage:
 *  <GraphicsLayer selectedKeys={[]}>
      <Graphic key="" highlight highlightSymbol={} geometryJson={} />
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
    this.originalSymbol = null
  }

  componentWillMount () {
    // load and add to graphicsLayer
    loadModules().then(({ Graphic }) => {
      const { graphicProperties, geometryJson } = this.props
      let graphic

      if (geometryJson) {
        graphic = Graphic.fromJSON(geometryJson)
      } else if (graphicProperties) {
        graphic = new Graphic(graphicProperties)
      } else {
        throw new Error('geometryJson and graphicProperties cannot to be empty at the same time')
      }

      this.add(graphic)
      this.setState({ graphic })
    })
  }

  componentWillUnmount () {
    this.remove(this.state.graphic)
  }

  componentDidUpdate (prevProps) {
    const { highlight, graphicProperties, geometryJson } = this.props
    const { graphic } = this.state

    // if graphic updated by graphicProperties or geometryJson
    // originalSymbol may need to be updated with new graphic symbol
    const updateOriginalSymbol = (newGraphic) => {
      if (this.originalSymbol) {
        this.originalSymbol = newGraphic.symbol
      }
    }
    
    if (geometryJson !== prevProps.geometryJson) {
      // need to create a new graphic
      loadModules().then(({ Graphic }) => {
        const newGraphic = Graphic.fromJSON(geometryJson)
        this.remove(graphic)
        this.add(newGraphic)
        updateOriginalSymbol(newGraphic)
        this.setState({ graphic: newGraphic }) // this will trigger componentDidUpdate again
      })

      // since setState will trigger componentDidUpdate() again, so no need to proceed code after
      return
    }

    if (graphicProperties !== prevProps.graphicProperties) {
      graphic.set(graphicProperties)
      updateOriginalSymbol(graphic)
    }

    if (highlight) {
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
    if (!this.originalSymbol) { // not highlighted yet
      return
    }

    graphic.symbol = this.originalSymbol
    this.originalSymbol = null
  }

  add (graphic) {
    this.props.graphicsLayer.add(graphic)
  }

  remove (graphic) {
    this.props.graphicsLayer.remove(graphic)
  }

  render () {
    console.log('Graphic render')
    return null
  }
}

Graphic.propTypes = {
  highlight: PropTypes.bool,
  highlightSymbol: PropTypes.object,
  geometryJson: PropTypes.object,
  graphicProperties: PropTypes.object // if geometryJson passed, graphicProperties will be ignored
}

Graphic.defaultProps = {
  highlight: false,
  highlightSymbol: null,
  geometryJson: null,
  graphicProperties: null
}

export default Graphic
