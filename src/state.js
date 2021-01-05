import { atom } from 'recoil'

export const wasmState = atom({
  key: 'wasm',
  default: null,
})

export const canvasState = atom({
  key: 'canvas',
  default: {
    data: null,
    canvas: null,
    memory: null,
  },
})

export const painterState = atom({
  key: 'painter',
  default: {
    r: 0,
    g: 0,
    b: 0,
    a: 100,
    brushSize: 10,
  },
})
