export var HIGHLIGHT_SYMBOLS = {
  point: {
    type: 'simple-marker',
    style: 'circle',
    color: 'lightblue',
    size: '8px',
    outline: {
      color: 'lightblue',
      width: 3
    }
  },
  multipoint: {
    type: 'simple-marker',
    style: 'circle',
    color: 'lightblue',
    size: '8px',
    outline: {
      color: 'lightblue',
      width: 3
    }
  },
  polyline: {
    type: 'simple-line',
    color: 'lightblue',
    width: 3
  },
  polygon: {
    type: "simple-fill",
    color: [6, 253, 255, .5],
    outline: {
      type: 'simple-line',
      color: 'lightblue',
      width: 1
    }
  },
  extent: {
    type: "simple-fill",
    color: [6, 253, 255, .5],
    outline: {
      type: 'simple-line',
      color: 'lightblue',
      width: 1
    }
  }
};