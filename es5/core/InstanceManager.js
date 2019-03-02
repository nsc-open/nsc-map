/**
 * usage:
 *    import { createNamespace } from 'InstanceManager'
 *    const mapNS = createNamespace('map')
 *    mapNS.register('a-map')
 *    mapNS.get('a-map').then(mapInstance => {})
 *    mapNS.set('a-map', instance)
 * 
 *    const sketchNS = createNamespace('sketch')
 *    ...
 */
import EventEmitter from 'eventemitter3';

class Namespace extends EventEmitter {
  constructor() {
    super();
    this.instances = {};
  }

  register(id) {
    if (this.instances[id]) {
      console.warn(`instance of id '${id}' exists, this will make it overrided`);
    }

    this.instances[id] = {
      instance: null
    };
  }

  unregister(id) {
    if (this.instances[id]) {
      this.instances[id] = null;
      this.emit(`${id}-unregister`);
    }
  }

  set(id, instance) {
    if (!this.instances[id]) {
      console.error(`instance of id '${id}' is not registered, please register it first`);
      return;
    }

    this.instances[id].instance = instance;
    this.emit(`${id}-ready`, instance);
  }

  get(id) {
    if (!this.instances[id]) {
      console.error(`instance of id '${id}' is not registered`);
      return;
    }

    if (this.instances[id].instance) {
      return Promise.resolve(this.instances[id].instance);
    } else {
      return new Promise((resolve, reject) => {
        this.once(`${id}-ready`, resolve);
        this.once(`${id}-unregister`, reject);
        this.once(`${id}-destroy`, reject);
      });
    }
  }

  destroy() {
    Object.keys(this.instances).forEach(id => {
      if (this.instances[id]) {
        this.emit(`${id}-destroy`);
      }
    });
    this.instances = {};
  }

}

const NAMESPACES = {};
export const createNamespace = key => {
  if (NAMESPACES[key]) {
    console.warn(`namespace[${key}] is already there, this will make it overrided`);
  }

  return NAMESPACES[key] = new Namespace();
};
export const deleteNamespace = key => {
  if (NAMESPACES[key]) {
    NAMESPACES[key].destroy();
    NAMESPACES[key] = null;
  }
};
export const getNamespace = key => NAMESPACES[key];