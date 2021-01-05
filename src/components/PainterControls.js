import React from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import { painterState } from '../state'
import { InputNumber } from 'antd'
import InputColor from 'react-input-color'

const Container = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;

  padding: 10px;
  background-color: white;

  border-left: 1px solid black;

  > div {
    margin-top: 10px;
  }
`

const PainterControls = () => {
  const [painter, setPainter] = useRecoilState(painterState)

  const onChange = (key, value) =>
    setPainter({
      ...painter,
      [key]: value,
    })

  const setColor = ({ r, g, b, a }) => {
    setPainter({
      ...painter,
      r,
      g,
      b,
      a,
    })
  }

  return (
    <Container>
      <span>Brush size</span>
      <InputNumber
        value={painter.brushSize}
        onChange={(value) => onChange('brushSize', value)}
      />
      <div>
        <InputColor
          initialValue="#5e72e4"
          onChange={setColor}
          placement="right"
        />
      </div>
    </Container>
  )
}

export default PainterControls
