import EventEmitter from 'eventemitter3';
import EsriModuleLoader from 'esri-module-loader';
import { createNamespace } from '../../../utils/InstanceManager';
import { toMecator } from '../../../utils/conversions';
import { polylineAngles, pathAngles } from '../../analysis/geometry';
import * as geometryUtils from '../../../utils/geometry';
let uid = 0;
const ns = createNamespace('__AngleMeasurement2DViewModel');

const angleFormatter = value => value.toFixed(1) + '°';

class AngleMeasurement2DViewModel {
  constructor({
    view
  }) {
    this.view = view;
    this.measureLabel = '';
    this.unit = '';
    this.measurement = null;
    this.sketchViewModel = null;
    this.graphicsLayer = null;
    this.labelGraphics = [];
    this.eventHandlers = [];
    this.uid = uid++;

    this._init();
  }

  _init() {
    EsriModuleLoader.loadModules(['esri/Graphic', 'esri/layers/GraphicsLayer', 'esri/widgets/Sketch/SketchViewModel']).then(({
      GraphicsLayer,
      SketchViewModel
    }) => {
      const graphicsLayer = new GraphicsLayer();
      const sketchViewModel = new SketchViewModel({
        view: this.view,
        layer: graphicsLayer,
        updateOnGraphicClick: false,
        defaultUpdateOptions: {
          toggleToolOnClick: false
        }
      });
      this.view.map.add(graphicsLayer);
      this.graphicsLayer = graphicsLayer;
      this.sketchViewModel = sketchViewModel;
      ns.set(`${this.uid}`, sketchViewModel);
    });
    ns.register(`${this.uid}`);
  }

  _createTextSymbol(text) {
    return {
      type: "text",
      // autocasts as new TextSymbol()
      color: "white",
      haloColor: "black",
      haloSize: "1px",
      text,
      xoffset: 3,
      yoffset: 3,
      font: {
        // autocast as new Font()
        size: 12,
        family: "sans-serif",
        weight: "bold"
      }
    };
  }

  _drawStartPoint(graphic) {
    console.log('draw start point');
  }

  _drawEndPoint(graphic) {
    console.log('draw end point');
  }

  _drawLabel(graphic) {
    this.labelGraphics.forEach(g => this.graphicsLayer.remove(g));
    const points = graphic.geometry.paths[0];
    const angles = pathAngles(points);
    console.log('points', points);
    console.log('pathAngles', pathAngles(points));
    EsriModuleLoader.loadModules(['esri/Graphic']).then(({
      Graphic
    }) => {
      const labelGraphics = [];

      for (let i = 0; i < points.length; i++) {
        if (i === 0 || i === points.length - 1) {
          continue;
        }

        const graphic = new Graphic({
          geometry: {
            type: 'point',
            x: points[i][0],
            y: points[i][1],
            spatialReference: {
              wkid: 102100
            }
          },
          symbol: this._createTextSymbol(angleFormatter(angles[i]))
        });
        this.graphicsLayer.add(graphic);
        labelGraphics.push(graphic);
      }

      this.labelGraphics = labelGraphics;
    });
  }

  destroy() {
    this.view.map.remove(this.graphicsLayer);
    this.sketchViewModel = null;
    this.graphicsLayer = null;
    this.anglePoints = [];
  }

  newMeasurement() {
    this.clearMeasurement();
    ns.get(`${this.uid}`).then(sketchViewModel => {
      sketchViewModel.create('polyline', {
        mode: 'click'
      });
      this.eventHandlers.push(sketchViewModel.on('create', ({
        graphic,
        state
      }) => {
        switch (state) {
          case 'start':
            this._drawStartPoint(graphic);

            break;

          case 'active':
            this._drawLabel(graphic);

            break;

          case 'complete':
            this._drawEndPoint(graphic);

            break;
        }
      }));
    });
  }

  clearMeasurement() {
    ns.get(`${this.uid}`).then(sketchViewModel => {
      console.log('resset');
      sketchViewModel.reset();
      this.graphicsLayer.removeAll();
      this.eventHandlers.forEach(h => h.remove());
      this.eventHandlers = [];
    });
  }

}

export default AngleMeasurement2DViewModel;