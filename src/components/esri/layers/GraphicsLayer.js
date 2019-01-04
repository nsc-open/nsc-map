import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import EsriModuleLoader from 'esri-module-loader'
import Graphic from '../Graphic'

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
 * <GraphicsLayer>
 *  <Graphic selected />
 *  <Graphic />
 * </GraphicsLayer>
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
    const { selectedKeys } = this.props
    // update graphicsLayer properties

    // handle selection
    if (selectedKeys !== prevProps.selectedKeys) {
      this.setState({ selectedKeys })
      return
    }
  }

  bindEvents () {
    const { view } = this.props
    this.eventHandlers = [view.on('click', this.clickHandler)]
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
    PropTypes.arrayOf(Graphic),
    PropTypes.instanceOf(Graphic)
  ]),
  graphicsLayerProperties: PropTypes.object.isRequired,

  // graphic selection related
  allowMapSelection: PropTypes.oneOf([
    PropTypes.bool,
    PropTypes.array // ['point-select', 'box-select']
  ]),
  selectedKeys: PropTypes.array,
  onSelectionChange: PropTypes.func // (selectedKeys, selectedGraphics) => {}
}

GraphicsLayer.defaultProps = {
  children: [],
  graphicsLayerProperties: null,
  allowMapSelection: ['point-select', 'box-select'],
  selectedKeys: [],
  onSelectionChange: null
}

export default GraphicsLayer