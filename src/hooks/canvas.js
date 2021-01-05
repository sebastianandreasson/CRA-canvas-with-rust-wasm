import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { appState } from '../state'

export const useCanvas = () => {
  const [app, setApp] = useRecoilState(appState)

  useEffect(() => {
    if (!app.canvas) return

    const resize = () => {
      let screen_width = window.innerWidth
      let screen_height = window.innerHeight

      app.canvas.style = `width: ${screen_width}px; height: ${screen_height}px;`
    }

    resize()
    window.addEventListener('resize', resize)

    return () => window.removeEventListener('resize', resize)
  }, [app.canvas])

  useEffect(() => {
    setApp({
      ...app,
      canvas: document.getElementById('canvas'),
    })
  }, [app, setApp])

  return app.canvas
}
