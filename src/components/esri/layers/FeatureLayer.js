import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import EsriModuleLoader from 'esri-module-loader'
import { addKey } from './utils'

var features = [{
  geometry: {
    type: "polygon", // autocasts as new Polygon()
    rings: [
      [-64.78, 32.3],
      [-66.07, 18.45],
      [-80.21, 25.78],
      [-64.78, 32.3]
    ]
  },
  attributes: {
    ObjectID: 1,
    DepArpt: "KATL",
    MsgTime: Date.now(),
    FltId: "UAL1"
  }
}];
const renderer = {
  type: "simple", // autocasts as new SimpleRenderer()
  symbol: {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: [227, 139, 79, 0.8],
    outline: { // autocasts as new SimpleLineSymbol()
      color: [255, 255, 255],
      width: 1
    }
  }
}

/**
 * usage:
 *  <FeatureLayer featureLayerProperties={} selectedKeys onSelectionChange>
 *    <Graphic />
 *    <Graphic />
 *  </FeatureLayer>
 */
class FeatureLayer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layer: null, // need to put layer as state, so once layer is created, render would run again
    }

    this.eventHandlers = []
  }

  componentWillMount () {
    EsriModuleLoader.loadModules([
      'FeatureLayer',
      'esri/widgets/Sketch/SketchViewModel'
    ]).then(({ FeatureLayer, SketchViewModel }) => {
      const { map } = this.props
      const layer = new FeatureLayer({
        source: features,
        geometryType: 'polygon',
        fields: [{
          name: 'ObjectID',
          alias: 'ObjectID',
          type: 'oid'
        }],
        objectIdField: 'ObjectID',
        renderer: renderer
      })
      map.add(layer)

      this.bindEvents()
      this.setState({ layer })

      setTimeout(() => {
        var sketch = new SketchViewModel({
          view: this.props.view,
          layer: layer
        })
        console.log('sketch', sketch)
      }, 5000)
      
    })
  }

  componentWillUnmount () {
    this.unbindEvents()
    this.props.map.remove(this.state.layer)
  }

  componentDidUpdate (prevProps) {
    
  }

  bindEvents () {
    const { view, allowPointerSelection } = this.props
    if (allowPointerSelection) {
      this.eventHandlers.push(view.on('click', e => {
        const { view, onSelectionChange } = this.props
        const { layer } = this.state

        view.hitTest(e).then(({ results }) => {
          const selectedGraphics = results.filter(r => r.graphic.layer === layer).map(r => r.graphic)
          console.log('selected f', selectedGraphics)

          this.props.view.whenLayerView(layer).then(layerView => {
            console.log('layerView', layerView)
            layerView.highlight(selectedGraphics)
          })

        })

       
      }))
    }
  }

  unbindEvents () {
    this.eventHandlers.forEach(h => h.remove())
  }

  getGraphicKeys (graphics = []) {
    return graphics.map(g => g.attributes.key)
  }

  render () {
    console.log('FeatureLayer render')
    const { children = [] } = this.props
    const { layer } = this.state

    if (layer) {
      const childProps = { layer } // pass graphicsLayer to direct children
      return Children.map(children, child => {
        const graphicKey = child.key
        addKey(child.props, graphicKey)
        return React.cloneElement(child, childProps)
      })
    } else {
      return null
    }
  }
}

FeatureLayer.propTypes = {
  allowPointerSelection: PropTypes.bool,
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  onSelectionChange: PropTypes.func
}

FeatureLayer.defaultProps = {
  allowPointerSelection: true,
  selectedKeys: [],
  onSelectionChange: null
}

export default FeatureLayer