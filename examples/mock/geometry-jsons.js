export const polyline = {
  geometry: {
    type: "polyline",  // autocasts as new Polyline()
    paths: [
      [-111.30, 52.68],
      [-98, 49.5],
      [-93.94, 29.89],
      [-64.78, 32.3]
    ]
  },
  symbol: {
    type: "simple-line",  // autocasts as SimpleLineSymbol()
    color: [255, 0, 0],
    width: 10
  },
  attributes: {
    ObjectID: 'demo-polyline-001',
    Name: "Keystone Pipeline",
    Owner: "TransCanada"
  }
}

export const point = {
  geometry: {
    type: "point",  // autocasts as new Point()
    longitude: -71.2643,
    latitude: 42.0909
  },
  symbol: {
    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
    color: [226, 119, 40]
  },
  attributes: {
    ObjectID: 'demo-point-001',
    Name: "Keystone Pipeline",
    Owner: "TransCanada"
  }
}