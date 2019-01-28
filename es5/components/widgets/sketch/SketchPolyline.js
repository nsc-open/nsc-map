import { Component } from 'react';
import PropTypes from 'prop-types';
import EsriModuleLoader from 'esri-module-loader'; // import turf from '@turf/turf'

const turf = require('@turf/turf');

const loadModules = () => EsriModuleLoader.loadModules(['esri/widgets/Sketch/SketchViewModel', 'esri/layers/GraphicsLayer', 'esri/Graphic']); // point | multipoint | polyline | polygon | circle | rectangle | move | transform | reshape


export const ACTIVE_TOOLS = {
  POINT: 'point',
  MULTIPOINT: 'multipoint',
  POLYLINE: 'polyline',
  POLYGON: 'polygon',
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
  MOVE: 'move',
  TRANSFORM: 'transform',
  RESHAPE: 'reshape'
};
export const CREATE_MODES = {
  HYBRID: 'hybrid',
  // applicable for polyline and polygon
  FREEHAND: 'freehand',
  // applicable for polygon, polyline, rectangle, circle
  CLICK: 'click' // applicable for point

};

const toMecator = ([lng, lat]) => {
  return turf.toMercator(turf.point([lng, lat])).geometry.coordinates;
};

const toWgs84 = ([x, y]) => {
  return turf.toWgs84(turf.point([x, y]));
};
/**
 * <Sketch view layer graphics={} tool="polyline" mode="freehand">
 *  <Button icon="line">POLYLINE</Button>
 * </Sketch>
 * 
 * It should be able to:
 *   1. interupt (cancel/redo/undo) outside of this component
 *   2. click event should not be mixed up with other map click events
 */


class Sketch extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    loadModules().then(({
      SketchViewModel,
      GraphicsLayer,
      Graphic
    }) => {
      const {
        view,
        map
      } = this.props;
      const layer = new GraphicsLayer();
      const g = new Graphic({
        geometry: {
          type: "polygon",
          rings: [[-64.07, 32.3], [-70.21, 15.78], [-54.78, 22.3], [-64.07, 32.3]].map(p => toMecator(p)),
          spatialReference: {
            wkid: 102100 // 这里必须使用 大地坐标，如果使用 经纬度，在 svm.update 后，坐标会转换，导致坐标混乱

          }
        },
        symbol: {
          type: "simple-fill",
          color: [227, 139, 79, 0.8],
          outline: {
            color: [255, 255, 255],
            width: 1
          }
        }
      });
      layer.add(g);
      map.add(layer);
      console.log('view,map, layer', view, map, layer);
      const svm = new SketchViewModel({
        view,
        layer,
        updateOnGraphicClick: false,
        defaultUpdateOptions: {
          // set the default options for the update operations
          toggleToolOnClick: false // only reshape operation will be enabled

        }
      }); // svm.create("rectangle")

      view.on('click', e => {
        console.log('-click-');

        if (svm.state === "active") {
          console.log('skip');
          return;
        }

        view.hitTest(e).then(r => {
          const re = r.results.find(r => r.graphic.layer === svm.layer);

          if (re) {
            console.log('find it', re.graphic);
            svm.update([re.graphic], {
              tool: 'reshape'
            });
          }
        });
      });
      /* svm.on('create', e => {
        if (e.state === 'complete') {
          console.log('create svm', e, view.graphics.items.length)
          // svm.create("circle")
        }
      }) */

      svm.on('update', e => {
        console.log('update', e);

        if (e.state === "cancel" || e.state === "complete") {
          svm.update(e.graphics, {
            tool: 'reshape'
          });
        }
      });
    });
  }

  render() {
    console.log('SketchPolyline', this.props);
    return null;
  }

}

Sketch.propTypes = {
  sketchViewModelProperties: PropTypes.object
};
Sketch.defaultProps = {
  view: undefined,
  layer: undefined,
  graphics: [],
  mode: undefined
};
export default Sketch;