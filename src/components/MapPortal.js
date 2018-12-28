
import React from 'react'
import { createPortal } from 'react-dom'

const styles = {
  position: 'absolute',
  display: 'inline-block',
  zIndex: 50
}

export default ({
  children,
  map,
  wrapper = true
}) => {
  if (wrapper) {
    return createPortal(<span style={styles}>{children}</span>, map.root)
  } else {
    return createPortal(children, map.root)
  }
}

// TODO add zIndex config here