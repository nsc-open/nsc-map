import BaseSelector from './BaseSelector'
import { SELECTOR_TYPE } from './constants'

/**
 * bind events and select graphics via selectionManager
 * highlight logic will be handled by GraphicSelectionManager
 */
class PointerSelector extends BaseSelector {
  
  constructor (args) {
    super(args)
    this.type = SELECTOR_TYPE.POINTER

    this._multipleMode = false
    this._eventHandlers = []
  }

  _bindEvents () {
    const { view, layers, selectionManager } = this.gsm

    this._eventHandlers.push(
      view.on('click', e => {
        view.hitTest(e).then(({ results }) => {
          const selectedGraphics = results.filter(r => layers.includes(r.graphic.layer)).map(r => r.graphic)

          if (this._multipleMode) {
            selectedGraphics.forEach(graphic => {
              if (selectionManager.includes(graphic)) {
                selectionManager.remove(graphic)
              } else {
                selectionManager.add(graphic)
              }
            })
          } else {
            selectionManager.select(selectedGraphics)
          }
        })
      }),
      view.on('key-down', e => {
        if (e.key === 'Control') {
          // start multiple selection
          this._multipleMode = true
        }
      }),
      view.on('key-up', e => {
        if (e.key === 'Control') {
          // end multiple selection
          this._multipleMode = false
        }
      })
    )
  }

  _unbindEvents () {
    this._eventHandlers.forEach(h => h.remove())
  }

  activate () {
    this._bindEvents()
  }

  deactivate () {
    this._unbindEvents()
  }
}

export default PointerSelector