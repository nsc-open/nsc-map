// single / multiple
// pointer-select / box-select / any-geometry-select
// by passing keys to make highlight
class GraphicSelectionManager {
  constructor(view) {
    this.view = view; // map view

    this.layer = null; // container layer of graphics

    this.selectedGraphics = [];
    this.highlight = null;
    this.eventHandlers = [];
  }

  _bindEvent() {
    const {
      view,
      layer,
      eventHandlers
    } = this;
    eventHandlers.push(view.on('click', e => {
      view.hitTest(e).then(({
        results
      }) => {
        const selectedGraphics = results.filter(r => r.graphic.layer === layer).map(r => r.graphic);
        view.whenLayerView(layer).then(layerView => {
          this.highlight = layerView.highlight(selectedGraphics);
        });
      });
    }));
  }

  _unbindEvent() {
    this.eventHandlers.forEach(h => h.remove());
  }

  activate(containerLayer) {}

  deactivate() {}

}