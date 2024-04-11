const wasmMan = (function() {
  // 私有变量,用于缓存已加载的 wasm 实例
  const instanceCache = new Map();

  return {
    // 从给定 URI 加载 wasm 字节码并缓存实例
    async load(wasmUri) {
      // 先检查缓存
      if (instanceCache.has(wasmUri)) {
        return instanceCache.get(wasmUri);
      }

      // 未缓存则加载 wasm
      const bytes = await fetchAndInstantiate(wasmUri);
      const instance = await WebAssembly.instantiate(bytes);
      instanceCache.set(wasmUri, instance);
      return instance;
    },

    // 创建 wasm 实例的导出对象
  create(wasmUri) {      const instancePromise = this.load(wasmUri);
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

    async function query() {
      const exports = this.instance.exports;
      const exportedItems = Object.keys(exports);

      return exportedItems.map(item => {
        const itemType = typeof exports[item];
        return { name: item, type: itemType };
      });
    }
  



  
  // 实用工具函数,用于加载 wasm 字节码
  async function fetchAndInstantiate(uri) {
    const response = await fetch(uri);
    const bytes = await response.arrayBuffer();
    return bytes;
  }
})();
