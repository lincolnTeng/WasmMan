# WasmMan   edit online by prose.io
WasmMan.js is a lightweight JavaScript library that simplifies loading and using WebAssembly modules in front-end development.It provides a convenient interface for fetching, instantiating, and invoking WebAssembly functions, making it easier to leverage the power of WebAssembly in web applications.

## Features
## Features

- **Easy Loading**: Load WebAssembly modules from a given URI with just one function call.
- **Instance Caching**: Automatically caches loaded WebAssembly instances to avoid redundant fetching and instantiation.
- **Friendly Interface**: Exposes a proxy object that allows direct invocation of exported WebAssembly functions, eliminating verbose syntax.
- **Extensible**: Designed with a minimal core, making it easy to extend and add more features as needed.

## Installation

You can install wasmMan.js via npm:



Or, include it directly in your HTML file:

```html
<script src="path/to/wasmman.js"></script>



// Load a WebAssembly module
const instance = await wasmMan.load('path/to/module.wasm');

// Call exported WebAssembly functions
const result = instance.exports.addNumbers(2, 3);

// or

// Create a proxy object for convenient function invocation
const exports = wasmMan.create('path/to/module.wasm');

// Call exported WebAssembly functions
const result = exports.addNumbers(2, 3); // 5
