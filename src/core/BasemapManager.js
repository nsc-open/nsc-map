import { loadModules } from 'esri-module-loader'

const removeBasemap = map => {
  if (map.basemap) {
    map.basemap.cancelLoad()
    map.basemap.baseLayers.forEach(layer => map.remove(layer))
  }
}

// sample basemaps:

// const BASEMAPS = [{
//   id: 'statellite',
//   label: '卫星影像',
//   mapLayer: {
//     urlTemplate: 'http://mt{subDomain}.google.cn/vt/lyrs=s&x={col}&y={row}&z={level}&s=Gali',
//     subDomains: '0123'.split('')
//   },
//   annotationLayer: {
//     urlTemplate: `http://t{subDomain}.tianditu.com/DataServer?tk=${TIANDITU_TOKEN}&T=cia_w&x={col}&y={row}&l={level}`,
//     subDomains: '01234567'.split('')
//   }
// }]

class BasemapManager {
  constructor ({ map, basemaps = [] }) {
    this.map = map
    this.annotationLayer = null

    this.basemaps = basemaps
    this.annotationVisible = false
  }

  _removeBasemap () {
    removeBasemap(this.map)
  }

  _setBasemap (basemap) {
    this._removeBasemap()

    loadModules([
      'esri/Basemap',
      'esri/layers/WebTileLayer'
    ]).then(({ Basemap, WebTileLayer }) => {
      const mapLayer = new WebTileLayer(basemap.mapLayer)
      const annotationLayer = new WebTileLayer({
        ...basemap.annotationLayer,
        visible: this.annotationVisible
      })

      this.annotationLayer = annotationLayer
      this.map.basemap = new Basemap({
        baseLayers: [mapLayer, annotationLayer]
      })
    })
  }

  showMap () {
    const basemap = this.basemaps.find(b => b.id === 'map')
    this._setBasemap(basemap)
  }

  showSatellite () {
    const basemap = this.basemaps.find(b => b.id === 'statellite')
    this._setBasemap(basemap)
  }

  showAnnotation () {
    this.annotationVisible = true
    if (this.annotationLayer) {
      this.annotationLayer.visible = true
    }
  }

  hideAnnotation () {
    this.annotationVisible = false
    if (this.annotationLayer) {
      this.annotationLayer.visible = false
    }
  }
}

BasemapManager.removeBasemap = removeBasemap

export default BasemapManager