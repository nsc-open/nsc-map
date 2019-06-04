import { Component } from 'react'
import PropTypes from 'prop-types'
import { loadModules } from 'esri-module-loader'
import * as utils from './utils'

const KEY_ATTRIBUTE = 'key'

const createGraphic = ({ properties, json }) => {
  return loadModules([
    'esri/Graphic'
  ]).then(({ Graphic }) => {
    if (properties) {
      return new Graphic(properties)
    } else if (json) {
      return Graphic.fromJSON(json)
    } else {
      throw new Error('properties and json cannot to be empty at the same time')
    }
  })
}

/**
 * usage:
 *  <GraphicsLayer>
      <Graphic key="" json={} />
      <Graphic key="" properties={} />
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

    this.highlightHandler = null
    this.eventHandlers = []
  }

  componentDidMount () {
    // load and add to graphicsLayer/featureLayer
    const { properties, json } = this.props
    createGraphic({ properties, json }).then(graphic => {
      this.setState({ graphic })
      this.add(graphic)
    })
  }

  componentWillUnmount () {
    const { graphic } = this.state
    if (graphic) {
      this.remove(graphic)
      this.highlightHandler = null
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { graphic: prevGraphic } = prevState
    const { properties, json, selected, selectable } = this.props

    const needSync = name => (!prevProps && name in this.props) || (prevProps && prevProps[name] !== this.props[name])

    if (prevGraphic) {
      if (needSync('properties')) {
        this.update(prevGraphic, properties)
      } else if (needSync('json')) {
        createGraphic({ properties, json }).then(graphic => {
          this.setState({ graphic }, () => {
            this.replace(graphic, prevGraphic)
          })
        })
      }
    }

    // process selected
    if (selectable) {
      if (selected && !this.highlightHandler) {
        this.highlight()
      } else if (!selected && this.highlightHandler) {
        this.clearHighlight()
      }
    } else {
      this.clearHighlight()
    }
    
  }

  bindEvents (graphic) {
    const { view } = this.props
    this.eventHandlers = [
      view.on('click', e => {
        view.hitTest(e).then(({ results }) => {
          const clicked = results.find(r => r.graphic === graphic)          
          if (clicked) {
            this.onClick(e)
          }
        })
      })
    ]
  }

  unbindEvents () {
    this.eventHandlers.forEach(h => h.remove())
    this.eventHandlers = []
  }

  onClick (e) {
    const { onClick, onSelect, selected, selectable } = this.props
    const { graphic } = this.state

    onClick && onClick(e)

    if (!selectable) {
      return
    }

    onSelect && onSelect(e, this)
  }

  highlight () {
    const { view, layer } = this.props
    const { graphic } = this.state
    view.whenLayerView(layer).then(layerView => {
      this.highlightHandler = utils.highlight(layerView, [graphic])
    })
  }

  clearHighlight () {
    this.highlightHandler.remove()
    this.highlightHandler = null
  }

  add (graphic) {
    console.log('add graphic')
    const { layer } = this.props
    if (layer.type === 'graphics') {
      layer.add(graphic)
    } else if (layer.type === 'feature') {
      layer.applyEdits({
        addFeatures: [graphic]
      })
    }

    this.bindEvents(graphic)
  }

  remove (graphic) {
    console.log('remove graphic')
    const { layer } = this.props
    if (layer.type === 'graphics') {
      layer.remove(graphic)
    } else if (layer.type === 'feature') {
      layer.applyEdits({
        deleteFeatures: [graphic]
      })
    }

    this.unbindEvents()
  }

  update (graphic, properties) {
    console.log('update graphic')
    graphic.set(properties)
  }

  /**
   * remove old graphic and add a new one
   * events will be binded again
   */
  replace (graphic, oldGraphic) {
    console.log('replace graphic')
    const { layer, selected } = this.props
    
    this.unbindEvents()
    selected && this.clearHighlight()

    if (layer.type === 'graphics') {
      layer.remove(oldGraphic)
      layer.add(graphic)
    } else if (layer.type === 'feature') {
      layer.applyEdits({
        deleteFeatures: [oldGraphic],
        addFeatures: [graphic]
      })
    }

    this.bindEvents(graphic)
    selected && this.highlight()
  }

  render () {
    console.log('Graphic.render', this.props)
    return null
  }
}

Graphic.propTypes = {
  // esri/Graphic constructor related props
  view: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  properties: PropTypes.object, // properties has higher priority than json when constructing a graphic
  json: PropTypes.object, // 

  selectable: PropTypes.bool,
  selected: PropTypes.bool,

  editable: PropTypes.bool,
  editing: PropTypes.bool
}

Graphic.defaultProps = {
  properties: null,
  json: null,

  selectable: true,
  selected: false,

  editable: true,
  editing: false
}


Graphic.keyAttribute = KEY_ATTRIBUTE
Graphic.getKey = props => {
  const { attributes = {} } = props.properties || props.json
  return attributes.key
}

export default Graphic