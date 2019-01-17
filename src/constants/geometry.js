// point | multipoint | polyline | polygon | extent | mesh
export const GEOMETRY_TYPE = {
  POINT: { key: 'point', zIndex: 5 },
  MULTIPOINT: { key: 'multipoint', zIndex: 4 },
  POLYLINE: { key: 'polyline', zIndex: 3 },
  POLYGON: { key: 'polygon', zIndex: 2 },
  EXTENT: { key: 'extent', zIndex: 1 },
  MESH: { key: 'mesh', zIndex: 0 }
}