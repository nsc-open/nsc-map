import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Popover, Switch, List } from 'antd'
import LayerLocator from './LayerLocator'
import { createLayerServiceInstance } from '../../utils/layer-service'

const ButtonGroup = Button.Group

const defaultLayerLoader = (map, layer) => {
  createLayerServiceInstance(layer).then(layerServiceInstance => {
    layerServiceInstance.visible = layer.visible
    map.add(layerServiceInstance)
  })
}

const setLayerVisibility = (map, layerId, visibility) => {
  const layer = map.findLayerById(layerId)
  console.log('- setLayerVisibility -', layer)
  layer && (layer.visible = visibility)
}

/**
 * LayerServiceSelector
 * it's an uncontrolled component, you cannot get selected layer status from outside (for now)
 * 
 * usage:
 *    <LayerServiceSelector map view categories layers />
 */
class LayerServiceSelector extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedLayerIds: props.layers.filter(l => l.visible).map(l => l.id)
    }
  }

  componentDidMount () {
    this.addLayers(this.props.layers)
  }

  addLayers (layers) {
    const { layerLoader, map } = this.props
    layers.forEach(layer => layerLoader(map, layer))
  }

  switchHandler = layer => {
    const { map } = this.props
    const { selectedLayerIds } = this.state
    let newSelectedLayerIds
    let checked

    if (!selectedLayerIds.includes(layer.id)) {
      newSelectedLayerIds = [...selectedLayerIds, layer.id]
      checked = true
    } else {
      newSelectedLayerIds = selectedLayerIds.filter(k => k !== layer.id)
      checked = false
    }

    this.setState({ selectedLayerIds: newSelectedLayerIds })
    setLayerVisibility(map, layer.id, checked)
  }

  locateHandler = layer => {
    const { map } = this.props
    const { selectedLayerIds } = this.state
    if (!selectedLayerIds.includes(layer.id)) {
      this.setState({ selectedLayerIds: [...selectedLayerIds, layer.id] })
      setLayerVisibility(map, layer.id, true)
    }
  }

  renderPopoverContent (categoryId) {
    const { layers, map, view } = this.props
    const { selectedLayerIds } = this.state
    const matched = layers.filter(layer => layer.categoryId === categoryId)
		
    if (matched.length === 0) {
      return <div style={{ fontSize:'12px',color:'rgba(0,0,0,.4)' }}>该分类下无图层</div>
    } else {
      return (
        <List
          size="small"
          bordered
          dataSource={matched}
          renderItem={item => (
            <List.Item
              actions={[
                <Switch checked={selectedLayerIds.includes(item.id)} onChange={() => this.switchHandler(item)} />,
                <LayerLocator map={map} view={view} layerId={item.id} onLocate={() => this.locateHandler(item)} />
              ]}
            >
              {item.name}
            </List.Item>
          )}
        />
      )
    }
  }

  render () {
    const { categories } = this.props
    if (categories.length === 0) {
      return null
    } else {
      return (
        <ButtonGroup>
        {categories.map((category, index) => {
          return (
            <Popover key={index} content={this.renderPopoverContent(category.id)} title={category.name} placement="bottomRight">
              <Button>{category.name}</Button>
            </Popover>
          )
        })}
        </ButtonGroup>
      )
    }
  }
}

LayerServiceSelector.propTypes = {
  map: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired, // [{ id, name }]
  layers: PropTypes.array.isRequired,     // [{ id, name, categoryId, url, type<tiled|dynamic>, visible, sortNo }]
  layerLoader: PropTypes.func.isRequired  // (map, layer) => {}
}

LayerServiceSelector.defaultProps = {
  map: undefined,
  view: undefined,
  categories: [],
  layers: [],
  layerLoader: defaultLayerLoader
}

export default LayerServiceSelector