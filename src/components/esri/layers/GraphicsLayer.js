import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import EsriModuleLoader from 'esri-module-loader'

const addKey = (graphicProps, key) => {
  const _add = (graphic, key) => {
    if (!graphic) {
      return graphic
    }
    if (!graphic.attributes) {
      graphic.attributes = {}
    }
    graphic.attributes.key = key
  }
  _add(graphicProps.geometryJson, key)
  _add(graphicProps.graphicProperties, key)
}

/**
 * usage:
 *  <GraphicsLayer selectedKeys={[]}>
      <Graphic key="" highlight highlightSymbol={} geometryJson={} />
      <Graphic key="" graphicProperties={} />
    </GraphicsLayer>
 */
class GraphicsLayer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layer: null, // need to put layer as state, so once layer is created, render would run again
      selectedKeys: props.selectedKeys || []
    }

    this.eventHandlers = []
    this.clickHandler = this.clickHandler.bind(this)
  }

  componentWillMount () {
    EsriModuleLoader.loadModules([
      'GraphicsLayer'
    ]).then(({ GraphicsLayer }) => {
      const { map } = this.props
      const layer = new GraphicsLayer()
      map.add(layer)

      this.bindEvents()
      this.setState({ layer })
    })
  }

  componentWillUnmount () {
    this.unbindEvents()
    this.props.map.remove(this.state.layer)
  }

  componentDidUpdate (prevProps) {
    const { selectedKeys, graphicsLayerProperties } = this.props
    const { layer } = this.state

    // update graphicsLayer properties
    if (graphicsLayerProperties !== prevProps.graphicsLayerProperties) {
      layer.set(graphicsLayerProperties)
    }

    // handle selection
    if (selectedKeys !== prevProps.selectedKeys) {
      this.setState({ selectedKeys })
      return
    }
  }

  bindEvents () {
    const { view, allowPointerSelection } = this.props
    if (allowPointerSelection) {
      this.eventHandlers.push(view.on('click', this.clickHandler))
    }
  }

  unbindEvents () {
    this.eventHandlers.forEach(h => h.remove())
  }

  getGraphicKeys (graphics = []) {
    return graphics.map(g => g.attributes.key)
  }

  clickHandler (e) {
    const { view, onSelectionChange } = this.props
    const { layer } = this.state
    const isControlled = onSelectionChange

    view.hitTest(e).then(({ results }) => {
      const selectedGraphics = results.filter(r => r.graphic.layer === layer).map(r => r.graphic)
      const selectedKeys = this.getGraphicKeys(selectedGraphics)

      if (!isControlled) {
        this.setState({ selectedKeys })
      } else {
        onSelectionChange(selectedKeys, selectedGraphics)
      }
    })
  }

  render () {
    console.log('GraphicsLayer render')
    const { children = [] } = this.props
    const { layer, selectedKeys } = this.state

    if (layer) {
      const childProps = { graphicsLayer: layer } // pass graphicsLayer to direct children
      return Children.map(children, child => {
        const graphicKey = child.key
        addKey(child.props, graphicKey)
        childProps.highlight = selectedKeys.includes(graphicKey)
        return React.cloneElement(child, childProps)
      })
    } else {
      return null
    }
  }
}

GraphicsLayer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]),
  graphicsLayerProperties: PropTypes.object,

  // graphic selection related
  allowPointerSelection: PropTypes.bool,
  selectedKeys: PropTypes.array,
  onSelectionChange: PropTypes.func // (selectedKeys, selectedGraphics) => {}
}

GraphicsLayer.defaultProps = {
  children: [],
  graphicsLayerProperties: null,
  allowPointerSelection: true,
  selectedKeys: [],
  onSelectionChange: null
}

export default GraphicsLayer