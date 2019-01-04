export const addKey = (graphicProps, key) => {
  const _add = (graphic, key) => {
    if (!graphic) {
      return graphic
    }
    if (!graphic.attributes) {
      graphic.attributes = {}
    }
    graphic.attributes.key = key
  }
  _add(graphicProps.geometryJson, key)
  _add(graphicProps.graphicProperties, key)
}