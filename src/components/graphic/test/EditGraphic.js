class GraphicTest extends Component {
  state = {
    selectedKeys: [],
    editingKeys: [] // 如果 editingKeys 被赋值，则开启指定的 graphics 进入 sketch 模式；如果置空，则清空 sketch 模式
  }

  selectHandler = (selectedKeys, { selected, graphic }) => {
    if (selected) {
      this.setState({ editingKeys: selectedKeys })
    }
  }

  sketchCreator = () => {
    const sketch = new SketchViewModel()
    sketch.on([], e => {
      if (complete) {
        // confirm popup / save to server / or other async task
        // update datasource with new graphic geometry
        // setState({ editingKeys: [] }) off the editing mode
      } else if (cancel) {
        // setState({ editingKeys: [] }) off the editing mode
      }
    })
  }

  render () {
    const { selectedKeys, editingKeys } = this.state
    return (
      <Map>
        <GraphicsLayer
          selectedKeys={selectedKeys}
          editingKeys={editingKeys}
          selectToEdit={false}
          selectable
          onSelect={this.selectHandler}
          sketch={this.sketchCreator}
        >
          {graphics.map(graphic => <Graphic properties={graphic} />)}
        </GraphicsLayer>
      </Map>
    )
  }
}