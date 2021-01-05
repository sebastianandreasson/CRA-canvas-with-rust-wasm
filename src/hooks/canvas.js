import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { canvasState } from '../state'

export const useCanvas = () => {
  const [state, setCanvas] = useRecoilState(canvasState)

  useEffect(() => {
    if (!state.canvas) return

    const resize = () => {
      let screen_width = window.innerWidth
      let screen_height = window.innerHeight

      state.canvas.style = `width: ${screen_width}px; height: ${screen_height}px;`
    }

    resize()
    window.addEventListener('resize', resize)

    return () => window.removeEventListener('resize', resize)
  }, [state.canvas])

  useEffect(() => {
    setCanvas({
      ...state,
      canvas: document.getElementById('canvas'),
    })
  }, [setCanvas])

  return state.canvas
}
