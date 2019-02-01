import React, { Component } from 'react'
import MapPortal from './MapPortal'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import Draggable from 'react-draggable'
import styles from './MapDraggable.css'

export default ({
  map,
  view,
  children,
  direction = 'horizontal',
  defaultPosition = { x: 100, y: 100 }
}) => {
  const isHorizontal = direction === 'horizontal'
  return (
    <MapPortal map={map} view={view} wrapper={false}>
      <Draggable
        handle={`.${styles.handler}`}
        defaultPosition={defaultPosition}
        bounds="parent"
      >
        <div className={styles.draggable}>
          <div className={isHorizontal ? styles.layoutHorizontal : styles.layoutVertical}>
            <div className={isHorizontal ? styles.handlerHorizontal : styles.handlerVertical}>
              <Icon type="drag" />
            </div>
            <div className={styles.main}>
            {children}
            </div>
          </div>
        </div>
      </Draggable>
    </MapPortal>
  )
}