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
    })
  }

  componentWillUnmount () {
    const { graphic } = this.state
    if (graphic) {
      this.remove(graphic)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // only when graphic is created, this component should be updated
    // or, this to ensure state.graphic always has value in componentDidUpdate
    if (!nextState.graphic) {
      return false
    } else {
      return true
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { graphic: prevGraphic } = prevState
    const { properties, json, selected, selectable } = this.props
    const { graphic } = this.state

    const needSync = name => (!prevProps && name in this.props) || (prevProps && prevProps[name] !== this.props[name])
    
    // graphic instance create or update
    if (needSync('json')) {
      createGraphic({ properties, json }).then(graphic => {
        this.setState({ graphic })
      })
      return // this return to ensure new graphic will be do replace in above statement
    }

    if (needSync('properties')) {
      this.update(graphic, properties)
    }

    if (graphic !== prevGraphic) {
      if (!prevGraphic) {
        this.add(graphic)
      } else {
        this.replace(graphic, prevGraphic)
      }
    }

    // process selected
    if (selectable) {
      if (needSync('selected') && selected) {
        this.highlight(graphic)
      } else if (needSync('selected') && !selected) {
        this.clearHighlight()
      }
    } else {
      this.clearHighlight()
    }
    
  }

  bindEvents (graphic) {
    const { view, hoverable, hoverCursor } = this.props
    this.eventHandlers = [
      view.on('click', e => {
        view.hitTest(e).then(({ results }) => {
          const hit = results.find(r => r.graphic === graphic)
          this.onClick(e, hit)
        })
      }),
      view.on('pointer-move', e => {
        if (!hoverable) {
          return
        }
        view.cursor = 'auto'
        view.hitTest(e).then(({ results }) => {
          results.forEach(r => {
            if (r.graphic === graphic) {
              view.cursor = hoverCursor || 'pointer'
            }
          })
        })
      })
    ]
  }

  unbindEvents () {
    this.eventHandlers.forEach(h => h.remove())
    this.eventHandlers = []
  }

  /**
   * when graphic instance changes (like replace graphic) but other status like selected not change,
   * the selected process logic in componentDidUpdate() won't refresh the highlight
   * in this case, manually sync is required
   */
  syncGraphicStatus (graphic) {
    const { selectable, selected } = this.props
    if (selectable && selected) {
      this.clearHighlight()
      this.highlight(graphic)
    }
  }

  onClick (e, hit) {
    const { onSelect, selectable } = this.props
    const { graphic } = this.state
    const key = graphic.attributes[Graphic.keyAttribute]

    if (selectable) {
      onSelect && onSelect(e, { key, graphic, selected: hit ? true : false })
    }
  }

  highlight (graphic) {
    console.log('higlight graphic')
    const { view, layer } = this.props
    view.whenLayerView(layer).then(layerView => {
      this.highlightHandler = utils.highlight(layerView, [graphic])
    })
  }

  clearHighlight () {
    console.log('clearHighlight graphic')
    if (this.highlightHandler) {
      this.highlightHandler.remove()
      this.highlightHandler = null
    }
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
    this.syncGraphicStatus(graphic) // sync status
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
    this.clearHighlight()
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
    const { layer } = this.props
    this.unbindEvents()

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
    this.syncGraphicStatus(graphic) // sync status
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

  hoverable: PropTypes.bool,
  hoverCursor: PropTypes.string,
  onHover: PropTypes.func,

  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,

  editable: PropTypes.bool,
  editing: PropTypes.bool,

  
}

Graphic.defaultProps = {
  properties: null,
  json: null,

  hoverable: true,
  hoverCursor: 'pointer',

  selectable: true,
  selected: false,

  editable: true,
  editing: false,

  onSelect: (e, { key, graphic, selected }) => {},
  onEdit: null
}


Graphic.keyAttribute = KEY_ATTRIBUTE
Graphic.getKey = props => {
  const { attributes = {} } = props.properties || props.json
  return attributes.key
}

export default Graphic