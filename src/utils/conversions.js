import * as turf from '@turf/turf'

export const toMecator = ([lng, lat]) => {
  return turf.toMercator(turf.point([lng, lat])).geometry.coordinates
}

export const toWgs84 = ([x, y]) => {
  return turf.toWgs84(turf.point([x, y]))
}