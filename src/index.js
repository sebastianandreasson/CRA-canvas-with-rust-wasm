import React, { useEffect } from 'react'
import { RecoilRoot, useRecoilState } from 'recoil'
import ReactDOM from 'react-dom'
import App from './App'
import { appState, wasmState } from './state'
import 'antd/dist/antd.css'

const Root = () => {
  const [wasm, setWasm] = useRecoilState(wasmState)
  const [app, setApp] = useRecoilState(appState)

  useEffect(() => {
    const run = async () => {
      try {
        const _wasm = await import('./cargo/build')
        setWasm(_wasm)
      } catch (e) {
        console.error(e)
      }
    }
    run()
  }, [setWasm])
  useEffect(() => {
    if (!wasm || app.data) return
    setApp({
      data: wasm.Canvas.new(window.innerWidth - 200, window.innerHeight),
      memory: wasm.wasm_memory(),
      canvas: null,
    })
  }, [wasm, app, setApp])

  if (!app.data) {
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
