// view

view.on('click', e => {

  const { view, onSelectionChange } = this.props
  const { layer } = this.state

  view.hitTest(e).then(({ results }) => {
    const selectedGraphics = results.filter(r => r.graphic.layer === layer).map(r => r.graphic)
    console.log('selected f', selectedGraphics)


    this.props.view.whenLayerView(layer).then(layerView => {
      console.log('layerView', layerView)
      if (this.highlight) {
        console.log("remove")
        this.highlight.remove()
      }
      this.highlight = layerView.highlight(selectedGraphics)
    })

  })

 
})
