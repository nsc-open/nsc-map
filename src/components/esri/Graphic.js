import { Component } from 'react'
import PropTypes from 'prop-types'
import EsriModuleLoader from 'esri-module-loader'

const HIGHLIGHT_SYMBOLS = {
  point: {
    type: 'simple-marker',
    style: 'circle',
    color: 'lightblue',
    size: '8px',
    outline: {
      color: 'lightblue',
      width: 3
    }
  },
  multipoint: {
    type: 'simple-marker',
    style: 'circle',
    color: 'lightblue',
    size: '8px',
    outline: {
      color: 'lightblue',
      width: 3
    }
  },
  polyline: {
    type: 'simle-line',
    color: 'lightblue',
    width: 3
  },
  polygon: {
    type: "simple-fill",
    color: [6, 253, 255, .5],
    outline: {
      type: 'simle-line',
      color: 'lightblue',
      width: 1
    }
  },
  extent: {
    type: "simple-fill",
    color: [6, 253, 255, .5],
    outline: {
      type: 'simle-line',
      color: 'lightblue',
      width: 1
    }
  }
}
/*
<GraphicsLayer>
  <Graphic selected highlightSymbol={} />
  <Graphic />
</GraphicsLayer>
*/
class Graphic extends Component {
  constructor (props) {
    super(props)
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
      // Create a polygon geometry
      const polygon = {
        type: "polygon", // autocasts as new Polygon()
        rings: [
        [-64.78, 32.3],
        [-66.07, 18.45],
        [-80.21, 25.78],
        [-64.78, 32.3]
        ]
      };

      // Create a symbol for rendering the graphic
      const fillSymbol = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: [227, 139, 79, 0.8],
        outline: { // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 1
        }
      };

      // Add the geometry and symbol to a new graphic
      const graphic = new Graphic({
        geometry: polygon,
        symbol: fillSymbol
      });

      
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
  highlightSymbol: PropTypes.object.isRequired,
  graphicProperties: PropTypes.object
}

Graphic.defaultProps = {
  selected: false,
  highlightSymbol: {},
  graphicProperties: {}
}

export default Graphic
