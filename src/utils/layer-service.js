import queryString from 'query-string'
import { loadModules } from 'esri-module-loader'

const LAYER_TYPE = {
  TILE: 'tiled',
  DYNAMIC: 'dynamic'
}
const registeredTokens = []

export const isPBS = (layerServiceUrl = '') => layerServiceUrl.includes('/PBS/')

export const parseToken = (layerServiceUrl = '') => {
  const { url, query } = queryString.parseUrl(layerServiceUrl)
  return { url, token: query.token }
}

/**
 * for secured layer service, token needs to be included in the url
 * note: basically arcgis layer service is able to access by ajax without any cross origin issue
 */
export const fetchArcgisLayerServiceJson = (layerServiceUrl = '') => {
  const { url, query } = queryString.parseUrl(layerServiceUrl)
  query.f = 'json'
  return fetch(`${url}?${queryString.stringify(query)}`).then(r => r.json())
}

/**
 * get layer service type, tiled or dynamic
 * if PBS, it is tile layer
 * if arcgis layer service, need to fetch with url?f=json to tell
 * 
 * securied layer service needs token included in layerServiceUrl
 */
export const inferLayerServiceType = (layerServiceUrl = '') => {
  if (isPBS(layerServiceUrl)) {
    return Promise.resolve(LAYER_TYPE.TILE)
  } else {
    return fetchArcgisLayerServiceJson(layerServiceUrl).then(json => json.tileInfo ? LAYER_TYPE.TILE : LAYER_TYPE.DYNAMIC)
  }
}

export const createLayerServiceInstance = ({ id, url = '', type }) => {
  return Promise.all([
    type ? Promise.resolve(type) : inferLayerServiceType(url),
    loadModules([
      'esri/layers/WebTileLayer',
      'esri/layers/TileLayer',
      'esri/layers/MapImageLayer',
      'esri/identity/IdentityManager'
    ])
  ]).then(([
    layerServiceType,
    { WebTileLayer, TileLayer, MapImageLayer, IdentityManager }
  ]) => {
    if (isPBS(url)) {
      return new WebTileLayer({ id, urlTemplate: url + '/tile/{level}/{row}/{col}' })
    } else {
      const { url: server, token } = parseToken(url)
      
      if (token && !registeredTokens.includes(token)) {
        IdentityManager.registerToken({
          server,
          token
        })
        registeredTokens.push(token)
      }

      return layerServiceType === LAYER_TYPE.TILE
        ? new TileLayer({ id, url })
        : new MapImageLayer({ id, url })
    }
  })
}