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
    create(wasmUri) {
      return new Proxy(this.load(wasmUri), {
        get(target, prop) {
          // 如果是导出的 wasm 函数则返回函数调用的包装
          if (target.instance.exports[prop] instanceof Function) {
            return target.instance.exports[prop].bind(target.instance.exports);
          }
          // 否则直接返回导出值
          return target.instance.exports[prop];
        }
      });
    }
  }


    query() {
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
