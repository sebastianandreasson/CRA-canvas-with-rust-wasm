import React, { useEffect } from 'react'
import { RecoilRoot, useRecoilState } from 'recoil'
import ReactDOM from 'react-dom'
import App from './App'
import { canvasState, wasmState } from './state'
import 'antd/dist/antd.css'

const Root = () => {
  const [wasm, setWasm] = useRecoilState(wasmState)
  const [canvas, setCanvas] = useRecoilState(canvasState)

  useEffect(() => {
    const run = async () => {
      try {
        const _wasm = await import('./cargo/build')
        console.log(_wasm)
        setWasm(_wasm)
      } catch (e) {
        console.error(e)
      }
    }
    run()
  }, [setWasm])
  useEffect(() => {
    if (!wasm) return
    console.log(wasm, canvas)
    setCanvas({
      data: wasm.Canvas.new(window.innerWidth - 200, window.innerHeight),
      memory: wasm.wasm_memory(),
      canvas: null,
    })
  }, [wasm, setCanvas])

  if (!canvas.data) {
    return <div>Loading...</div>
  }

  return <App />
}

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Root />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
