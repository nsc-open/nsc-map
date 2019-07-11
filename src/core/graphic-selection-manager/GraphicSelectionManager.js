import EventEmitter from 'eventemitter3'
import SelectionManager from '../SelectionManager'
import PointerSelector from './PointerSelector'
import BoxSelector from './BoxSelector'
import { SELECTOR_TYPE } from './constants'
import { highlight } from '../../utils/highlight'

/**
 * This support graphics selection and highlight from multiple layers (graphicsLayer or featureLayer)
 * NOTE: highlight GraphicsLayer is only support in SceneView.
 *       https://developers.arcgis.com/javascript/latest/api-reference/esri-views-layers-GraphicsLayerView.html#highlight
 * 
 * usage:
 *   const gsm = new GraphicSelectionManager({ view, layers: [graphicsLayer1, graphicsLayer2, featureLayer, ...] })
 *   gms.activate({ tool: 'pointer', multiSelect: true })
 *   gms.on('selectionChange', data => {})
 */
class GraphicSelectionManager extends EventEmitter {
  constructor ({
    view,
    layers,
    graphicComparator = (g1, g2) => g1 === g2
  }) {
    super()

    if (!view) {
      throw new Error('view is required')
    }

    this.view = view            // map view
    this.layers = layers || []
    this.highlights = []        // each layer would have a highlight
    this.selectionManager = new SelectionManager({ comparator: graphicComparator })

    this._init()
  }

  _init () {
    // inside of a specified selector, like PointerSelector, would operate selectionManager, which will emit events
    this.selectionManager.on('selectionChange', this._selectionChangeHandler)    
  }

  _selectionChangeHandler = ({ selection, added, removed, ...rest }) => {
    this.highlight(selection)
    this.emit('selectionChange', ({ selection, added, removed, ...rest }))
  }

  clearHighlight () {
    this.highlights.forEach(h => h.remove())
  }

  highlight (selection = []) {
    const { view, layers } = this

    layers.forEach((layer, index) => {
      this.highlights[index] && this.highlights[index].remove()
      
      view.whenLayerView(layer).then(layerView => {
        // this.highlights[index] = layerView.highlight(selection.filter(s => s.layer === layer))
        this.highlights[index] = highlight(layerView, selection.filter(s => s.layer === layer))
      })
    })
  }

  addLayer (layer) {
    if (this.layers.indexOf(layer) === -1) {
      this.layers.push(layer)
    }
  }

  removeLayer (layer) {
    const index = this.layers.indexOf(layer)
    if (index > -1) {
      this.layers = this.layers.filter((_, i) => i !== index)
      this.highlights = this.highlights.filter((_, i) => i !== index)
    }
  }

  activate ({ type = SELECTOR_TYPE.POINTER, multiSelect }) {
    this.deactivate()

    if (type === SELECTOR_TYPE.POINTER) {
      this.selector = new PointerSelector(this)
      this.selectionManager.mode(multiSelect === true ? SelectionManager.MODE.MULTIPLE : SelectionManager.MODE.SINGLE) // default with single
    } else if (type === SELECTOR_TYPE.BOX) {
      this.selector = new BoxSelector(this)
      this.selectionManager.mode(multiSelect === false ? SelectionManager.MODE.SINGLE : SelectionManager.MODE.MULTIPLE) // default with multiple
    }

    this.selector.activate()
  }

  deactivate () {
    if (this.selector) {
      this.clearHighlight()
      this.selector.deactivate()
      this.selector.destroy()
      this.selector = null
    }
  }

  destroy () {
    this.deactivate()
    this.selectionManager.removeListener('selectionChange', this._selectionChangeHandler)

    this.highlights.forEach(h => h && h.remove())
    this.highlights = []
  }
}

export default GraphicSelectionManager