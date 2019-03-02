function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, Switch, List } from 'antd';
import LayerLocator from './LayerLocator';
import { createLayerServiceInstance } from '../../utils/layer-service';
const ButtonGroup = Button.Group;

const defaultLayerLoader = (map, layer) => {
  createLayerServiceInstance(layer).then(layerServiceInstance => {
    layerServiceInstance.visible = layer.visible;
    map.add(layerServiceInstance);
  });
};

const setLayerVisibility = (map, layerId, visibility) => {
  const layer = map.findLayerById(layerId);
  console.log('- setLayerVisibility -', layer);
  layer && (layer.visible = visibility);
};
/**
 * LayerServiceSelector
 * it's an uncontrolled component, you cannot get selected layer status from outside (for now)
 * 
 * usage:
 *    <LayerServiceSelector map view categories layers />
 */


class LayerServiceSelector extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "switchHandler", layer => {
      const {
        map
      } = this.props;
      const {
        selectedLayerIds
      } = this.state;
      let newSelectedLayerIds;
      let checked;

      if (!selectedLayerIds.includes(layer.id)) {
        newSelectedLayerIds = [...selectedLayerIds, layer.id];
        checked = true;
      } else {
        newSelectedLayerIds = selectedLayerIds.filter(k => k !== layer.id);
        checked = false;
      }

      this.setState({
        selectedLayerIds: newSelectedLayerIds
      });
      setLayerVisibility(map, layer.id, checked);
    });

    _defineProperty(this, "locateHandler", layer => {
      const {
        map
      } = this.props;
      const {
        selectedLayerIds
      } = this.state;

      if (!selectedLayerIds.includes(layer.id)) {
        this.setState({
          selectedLayerIds: [...selectedLayerIds, layer.id]
        });
        setLayerVisibility(map, layer.id, true);
      }
    });

    this.state = {
      selectedLayerIds: props.layers.filter(l => l.visible).map(l => l.id)
    };
  }

  componentDidMount() {
    this.addLayers(this.props.layers);
  }

  addLayers(layers) {
    const {
      layerLoader,
      map
    } = this.props;
    layers.forEach(layer => layerLoader(map, layer));
  }

  renderPopoverContent(categoryId) {
    const {
      layers,
      map,
      view
    } = this.props;
    const {
      selectedLayerIds
    } = this.state;
    const matched = layers.filter(layer => layer.categoryId === categoryId);

    if (matched.length === 0) {
      return React.createElement("div", {
        style: {
          fontSize: '12px',
          color: 'rgba(0,0,0,.4)'
        }
      }, "\u8BE5\u5206\u7C7B\u4E0B\u65E0\u56FE\u5C42");
    } else {
      return React.createElement(List, {
        size: "small",
        bordered: true,
        dataSource: matched,
        renderItem: item => React.createElement(List.Item, {
          actions: [React.createElement(Switch, {
            checked: selectedLayerIds.includes(item.id),
            onChange: () => this.switchHandler(item)
          }), React.createElement(LayerLocator, {
            map: map,
            view: view,
            layerId: item.id,
            onLocate: () => this.locateHandler(item)
          })]
        }, item.name)
      });
    }
  }

  render() {
    const {
      categories
    } = this.props;

    if (categories.length === 0) {
      return null;
    } else {
      return React.createElement(ButtonGroup, null, categories.map((category, index) => {
        return React.createElement(Popover, {
          key: index,
          content: this.renderPopoverContent(category.id),
          title: category.name,
          placement: "bottomRight"
        }, React.createElement(Button, null, category.name));
      }));
    }
  }

}

LayerServiceSelector.propTypes = {
  map: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  // [{ id, name }]
  layers: PropTypes.array.isRequired,
  // [{ id, name, categoryId, url, type<tiled|dynamic>, visible, sortNo }]
  layerLoader: PropTypes.func.isRequired // (map, layer) => {}

};
LayerServiceSelector.defaultProps = {
  map: undefined,
  view: undefined,
  categories: [],
  layers: [],
  layerLoader: defaultLayerLoader
};
export default LayerServiceSelector;