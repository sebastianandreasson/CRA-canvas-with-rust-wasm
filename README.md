# CRA-canvas-with-rust-wasm
template(ish) CRA frontend with recoil for state using regl for rendering and WASM with Rust for processing.

Using as a starting point for my own projects while learning WebAssembly and Rust, this repository has some example code for a simple paint program where each pixel in the canvas lives in the Rust code and is accessed by regl via shared memory to render. React hooks are used for painting and recoil for state.

I created this because when looking at the current template projects out there for trying out webassembly together with React I didn't really find any for my liking , so this is a little bit of a mish mash of different things I found.
