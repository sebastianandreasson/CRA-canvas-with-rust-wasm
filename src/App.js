import React, { useEffect } from 'react'
import { renderLoop } from './render'
import { usePainter } from './hooks/paint'
import { useCanvas } from './hooks/canvas'
import { useRecoilValue } from 'recoil'
import { appState } from './state'
import styled from 'styled-components'

import PainterControls from './components/PainterControls'

const Container = styled.div`
  display: flex;
  flex-direction: row;
`

const App = () => {
  const { canvas, data, memory } = useRecoilValue(appState)
  useCanvas()
  usePainter()

  useEffect(() => {
    if (canvas) {
      renderLoop({
        data,
        memory,
        canvas,
      })
    }
  }, [canvas, memory, data])

  return (
    <Container>
      <canvas id="canvas"></canvas>
      <PainterControls />
    </Container>
  )
}

export default App
