/**
 * The portal component to a given map. It should be ported to map container, which is mapView.container
 */
import { createPortal } from 'react-dom';

var MapPortal = function MapPortal(_ref) {
  var children = _ref.children,
      map = _ref.map,
      view = _ref.view;
  // in 3.x api, map container is map.root
  // in 4.x api, map container is mapView.container
  return createPortal(children, view.container || map.root);
};

export default MapPortal;