export const polyline = {
  geometry: {
    type: "polyline",  // autocasts as new Polyline()
    paths: [
      [-111.30, 52.68],
      [-98, 49.5],
      [-93.94, 29.89]
    ]
  },
  symbol: {
    type: "simple-line",  // autocasts as SimpleLineSymbol()
    color: [255, 0, 0],
    width: 10
  },
  attributes: {
    ObjectID: 'demo-polyline-001',
    Name: "line",
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
    Name: "point",
    Owner: "TransCanada"
  }
}

export const polygon = {
  geometry: {
    type: "polygon", // autocasts as new Polygon()
    rings: [
    [-64.78, 32.3],
    [-66.07, 18.45],
    [-80.21, 25.78],
    [-64.78, 32.3]
    ]
  },
  symbol: {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: [227, 139, 79, 0.8],
    outline: { // autocasts as new SimpleLineSymbol()
    color: [255, 255, 255],
    width: 1
    }
  },
  attributes: {
    ObjectID: 'demo-polygon-001',
    Name: "gon",
    Owner: "TransCanada"
  }
}

export const polygon1 = {
  geometry: {
    type: "polygon", // autocasts as new Polygon()
    rings: [
    [-64.07, 32.3],
    [-70.21, 15.78],
    [-54.78, 22.3],
    [-64.07, 32.3],
    ]
  },
  symbol: {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: [227, 139, 79, 0.8],
    outline: { // autocasts as new SimpleLineSymbol()
    color: [255, 255, 255],
    width: 1
    }
  },
  attributes: {
    ObjectID: 'demo-polygon-001',
    Name: "gon1",
    Owner: "TransCanada"
  }
}


export const polygon2 = {
  geometry: {
    type: "polygon", // autocasts as new Polygon()
    rings: [
      [-64.78, 32.3],
      [-66.07, 18.45],
      [-80.21, 25.78],
      [-64.78, 32.3]
    ]
  },
  symbol: {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: [227, 139, 79, 0.8],
    outline: { // autocasts as new SimpleLineSymbol()
    color: [255, 255, 255],
    width: 1
    }
  },
  attributes: {
    ObjectID: 'demo-polygon-001',
    Name: "gon2",
    Owner: "TransCanada"
  }
}