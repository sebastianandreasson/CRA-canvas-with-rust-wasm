import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { canvasState, painterState } from '../state'

const eventDistance = (a, b) => {
  return Math.sqrt(
    Math.pow(a.clientX - b.clientX, 2) + Math.pow(a.clientY - b.clientY, 2),
    2
  )
}

const magnitude = (a) => {
  return Math.sqrt(Math.pow(a.clientX, 2) + Math.pow(a.clientY, 2), 2)
}

const norm = (a) => {
  let mag = magnitude(a)
  return { clientX: a.clientX / mag, clientY: a.clientY / mag }
}
const scale = (a, s) => {
  return { clientX: a.clientX * s, clientY: a.clientY * s }
}
const add = (a, b) => {
  return { clientX: a.clientX + b.clientX, clientY: a.clientY + b.clientY }
}
const sub = (a, b) => {
  return { clientX: a.clientX - b.clientX, clientY: a.clientY - b.clientY }
}

let painting = false
let lastPaint = null
let repeat = null

const clickInsideUI = (x, y) => {
  const width = window.innerWidth

  if (x >= width - 200) {
    return true
  }
  return false
}

function smoothPaint({ data, canvas, painter, event }) {
  clearInterval(repeat)
  repeat = window.setInterval(
    () => paint({ data, painter, canvas, event: startEvent }),
    25
  )
  let startEvent = { clientX: event.clientX, clientY: event.clientY }
  if (!painting) {
    return
  }

  let i = 0
  paint({ data, painter, canvas, event: startEvent })
  if (lastPaint) {
    while (eventDistance(startEvent, lastPaint) > painter.brushSize / 3) {
      let d = eventDistance(startEvent, lastPaint)
      startEvent = add(
        startEvent,
        scale(norm(sub(lastPaint, event)), Math.min(painter.brushSize / 3, d))
      )
      i++
      if (i > 1000) {
        break
      }
      paint({ data, painter, canvas, event: startEvent })
    }
  }
  lastPaint = event
}

const paint = ({ data, canvas, painter, event }) => {
  if (clickInsideUI(event.clientX, event.clientY)) return
  const width = data.width()
  const height = data.height()

  const scaleX = width / canvas.getBoundingClientRect().width
  const scaleY = height / canvas.getBoundingClientRect().height
  const x = Math.floor(event.clientX * scaleX)
  const y = Math.floor(event.clientY * scaleY)

  data.paint(
    x,
    y,
    painter.brushSize,
    painter.r,
    painter.g,
    painter.b,
    painter.a * 2.55
  )
}

export const usePainter = () => {
  const painter = useRecoilValue(painterState)
  const { data, canvas } = useRecoilValue(canvasState)

  const onPaint = useEffect(() => {
    if (!canvas) return

    const handleMouseDown = (event) => {
      clearInterval(repeat)
      event.preventDefault()

      painting = true
      clearInterval(repeat)
      repeat = window.setInterval(
        () => paint({ event, data, canvas, painter }),
        25
      )
      paint({ event, data, canvas, painter })
      lastPaint = event
    }

    const handleMouseUp = (event) => {
      clearInterval(repeat)
      if (painting) {
        event.preventDefault()
        lastPaint = null
        painting = false
      }
    }

    const handleMouseMove = (event) => {
      clearInterval(repeat)
      smoothPaint({ data, canvas, painter, event })
    }

    const handleMouseLeave = (_) => {
      clearInterval(repeat)
      lastPaint = null
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [painter, data, canvas])

  return onPaint
}
