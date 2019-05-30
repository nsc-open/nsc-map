class GraphicTest extends Component {
  renderGraphics () {
    return 
  }

  render () {
    return (
      <Map>
        <GraphicsLayer
          selectedKeys={}
          editingKey={}
          selectable
          hoverable
          onSelect
          onHover
          sketch={() => createSketch()}
        >
          <Graphic json={} selectable hoverable editable />
          <Graphic properties={} />
        </GraphicsLayer>
        <FeatureLayer>
          <Graphic json={} />
          <Graphic properties={} />
        </FeatureLayer>
        <SceneViewTest>
          <Graphic json={} />
          <Graphic properties={} />
        </SceneViewTest>
        <CustomizedGraphicContainerLayer>
          <Graphic json={} />
          <Graphic properties={} />
        </CustomizedGraphicContainerLayer>
      </Map>
      
    )
  }
}