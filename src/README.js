<Map>
  <GroundObjectLayer>
    {groundObjects.map(data => 
      <GroundObject key={data.id} geometryJson={data.geometryJson} />
    )}
  </GroundObjectLayer>

  <SketchTools />
  <MeasureTools />
  <DynamicLayerSelector />
  <BaseMapSelector />
</Map>