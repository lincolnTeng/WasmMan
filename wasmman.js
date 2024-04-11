const wasmMan = (function() {
  const instanceCache = new Map();

  return {
    async load(wasmUri) {
      if (instanceCache.has(wasmUri)) {
        return instanceCache.get(wasmUri);
      }

      const bytes = await fetchAndInstantiate(wasmUri);
      const instance = await WebAssembly.instantiate(bytes);
      instanceCache.set(wasmUri, instance.instance);
      return instance.instance;
    },

    create(wasmUri) {
      const instancePromise = this.load(wasmUri);
      const instanceProxy = new Proxy(instancePromise, {
        get(target, prop) {
          if (prop === 'then') {
            return target.then.bind(target);
          }
          return async (...args) => {
            const instance = await target;
            if (instance.exports[prop] instanceof Function) {
              return instance.exports[prop].bind(instance.exports)(...args);
            }
            return instance.exports[prop];
          };
        }
      });

      instanceProxy.query = this.query.bind(instanceProxy);
      return instanceProxy;
    },

    query() {
      const exports = this.instance.exports;
      const exportedItems = Object.keys(exports);

      return exportedItems.map(item => {
        const itemType = typeof exports[item];
        return { name: item, type: itemType };
      });
    }
  }

  async function fetchAndInstantiate(uri) {
    const response = await fetch(uri);
    const bytes = await response.arrayBuffer();
    return bytes;
  }
})();
