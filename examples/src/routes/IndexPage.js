import React, { Component } from 'react'
import { Map } from 'react-arcgis'
import GraphicsLayer from 'nsc-map/components/esri/layers/GraphicsLayer'
import Graphic from 'nsc-map/components/esri/Graphic'

export default class extends Component {
  state = {
    n: 0
  }

  componentDidMount () {
    setInterval(() => {
      this.setState({ n: this.state.n + 1 })
    }, 2000)
  }

  render () {
    const { n } = this.state
    return (
      <Map>
        <GraphicsLayer>
        <Graphic selected={n%2 === 0} />
        </GraphicsLayer>
      </Map>
    )
  }
}
