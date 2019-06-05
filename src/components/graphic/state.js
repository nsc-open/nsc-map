import EventEmitter from 'eventemitter3'
import * as utils from './utils'

class BaseState {
  constructor (stateMananger) {
    this.stateManager = stateMananger
    this.key = 'base'
  }
  init () {}
  destroy () {}
  update () {}
  select () {}
  deselect () {}
  edit () {}
  quitEdit () {}
}

class Initializing extends BaseState {
  constructor (props) {
    super(props)
    this.key = 'initializing'
    this.init()
  }
  init () {}
  destroy () {}
  update () {}
  select () {}
  deselect () {}
  edit () {}
  quitEdit () {}
}

class Normal extends BaseState {
  constructor (props) {
    super(props)
    this.key = 'normal'
    this.init()
  }

  init () {}
  destroy () {}

  update (properties) {
    const { layer, graphic } = this.stateManager
    utils.updateGraphic(layer, graphic, { properties })
  }

  select () {
    this.stateManager.changeState('selected')
  }

  deselect () {
    // do nothing
  }

  edit () {
    this.stateManager.changeState('editing')
  }

  quitEdit () {
    // do nothing
  }
}

class Selected extends BaseState {

  constructor (props) {
    super(props)
    this.key = 'selected'
    this.highlightHandler = null
    this.symbolProperty = null
    this.init()
  }

  init () {
    console.log('selected.init')
    const { view, layer, graphic } = this.stateManager
    view.whenLayerView(layer).then(layerView => {
      console.log('selected.init highlight')
      this.highlightHandler = utils.highlight(layerView, [graphic])
    })
  }

  destroy () {
    console.log('Select destroy', this.highlightHandler)
    if (this.highlightHandler) {
      this.highlightHandler.remove()
      this.highlightHandler = null
    }

    // if stored updated symbol, restore it
    if (this.symbolProperty) {
      //const { layer, graphic } = this.stateManager
      //utils.updateGraphic(layer, graphic, { symbol: this.symbolProperty })
    }
  }
  
  update (properties) {
    const { layer, graphic } = this.stateManager
    // if trying to change symbol, it will be stored and updated with this symbol after exit this state
    // in this state, symbol won't be change coz it uses the highlight symbol
    if ('symbol' in properties) {
      this.symbolProperty = properties.symbol
    }
    const { geometry, attributes } = properties
    utils.updateGraphic(layer, graphic, { properties: { geometry, attributes } })
  }

  select () {
    // do nothing, already in selected state
  }

  deselect () {
    this.stateManager.changeState('normal')
  }

  edit () {
    this.stateManager.changeState('editing')
  }

  quitEdit () {
    // do nothing
  }
}

// graphic 发生变化时，需要更新 tempGraphicsLayer 中的 clonedGraphic
class Editing extends BaseState {
  constructor (props) {
    super(props)
    this.key = 'editing'
    this.clonedGraphic = null
    this.tempGraphicsLayer = null
    this.symbolProperty = null
    this.init()
  }

  init () {
    // new sketch
  }

  destroy () {
    // destroy sketch, clonedGraphic, tempGraphicsLayer

    

    // if stored updated symbol, restore it
    if (this.symbolProperty) {
      const { layer, graphic } = this.stateManager
      utils.updateGraphic(layer, graphic, { properties: { symbol: this.symbolProperty } })
    }
  }

  update (properties) {
    const { layer, graphic } = this.stateManager
    // if trying to change symbol, it will be stored and updated with this symbol after exit this state
    // in this state, symbol won't be change coz it uses the highlight symbol
    if ('symbol' in properties) {
      this.symbolProperty = properties.symbol
    }
    const { geometry, attributes } = properties
    utils.updateGraphic(layer, graphic, { properties: { geometry, attributes } })
  }

  select () {
    // do nothing
  }

  deselect () {
    // do nothing
  }

  edit () {
    // do nothing
  }

  quitEdit () {
    this.stateManager.changeState(this.stateManager.prevState || 'normal')
  }
}

export default class StateManager extends EventEmitter {
  constructor ({ view, layer }) {
    super()
    this.view = view
    this.layer = layer
    this.graphic = null
    this.eventHandlers = []

    this.state = new BaseState()
  }

  init ({ properties, json }) {
    this.changeState('initializing')
    utils.createGraphic({ properties, json }).then(graphic => {
      this.graphic = graphic
      utils.addGraphic(this.layer, graphic)
      this.bindEvents()
      this.changeState('normal')
    })
  }

  destroy () {
    this.state.destroy()
    this.unbindEvents()
    utils.removeGraphic(this.layer, this.graphic)
  }

  update (params) {
    console.log('update =>')
    this.state.update(params)
  }

  bindEvents () {
    const { view, graphic } = this
    this.eventHandlers = [
      view.on('click', e => {
        view.hitTest(e).then(({ results }) => {
          const hit = results.find(r => r.graphic === graphic)
          this.emit('click', { e, hit })
        })
      }),
      view.on('pointer-move', e => {
        view.hitTest(e).then(({ results }) => {
          const hit = results.find(r => r.graphic === graphic)
          this.emit('hover', { e, hit })
        })
      })
    ]
  }

  unbindEvents () {
    this.eventHandlers.forEach(h => h.remove())
    this.eventHandlers = []
  }

  changeState (stateKey) {
    if (this.state) {
      this.prevState = this.state.key
      this.state.destroy()
    }

    const StateClass = ({
      'normal': Normal,
      'initializing': Initializing,
      'editing': Editing,
      'selected': Selected
    })[stateKey]

    this.state = new StateClass(this)
  }

  /***** actions *****/
  

  select () {
    console.log('select')
    this.state.select()
  }
  
  deselect () {
    console.log('deselect')
    this.state.deselect()
  }

  edit () {
    this.state.edit()
  }

  quitEdit () {
    this.state.quitEdit()
  }
}