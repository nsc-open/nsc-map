import React, { Component } from 'react'
import MapPortal from './MapPortal'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import Draggable from 'react-draggable'
// import styles from './MapDraggable.css'

const styles = {
  draggable: {
    position: 'absolute',
    zIndex: 50,
    display: 'inline-block',
    borderRadius: '2px',
    background: '#fafafa',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
  },
  layoutHorizontal: {
    display: 'flex',
    flexDirection: 'row',
    minWidth: '100px'
  },
  layoutVertical: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '20px'
  },
  handlerHorizontal: {
    cursor: 'move',
    padding: '6px 8px',
    borderRight: '1px solid #e8e8e8'
  },
  handlerVertical: {
    cursor: 'move',
    padding: '4px 8px',
    borderBottom: '1px solid #e8e8e8'
  },
  main: {
    padding: '6px 8px'
  }
}

export default ({
  map,
  view,
  zIndex,
  children,
  direction = 'horizontal',
  defaultPosition = { x: 100, y: 100 }
}) => {
  const isHorizontal = direction === 'horizontal'
  return (
    <MapPortal map={map} view={view}>
      <Draggable
        handle={`.handler`}
        defaultPosition={defaultPosition}
        bounds="parent"
      >
        <div style={{ ...styles.draggable, zIndex }}>
          <div style={isHorizontal ? styles.layoutHorizontal : styles.layoutVertical}>
            <div className="handler" style={isHorizontal ? styles.handlerHorizontal : styles.handlerVertical}>
              <Icon type="drag" />
            </div>
            <div style={styles.main}>
            {children}
            </div>
          </div>
        </div>
      </Draggable>
    </MapPortal>
  )
}