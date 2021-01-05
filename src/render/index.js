import reglBuilder from 'regl'
import frag from '../glsl/frag.glsl'
import vert from '../glsl/vertex.glsl'

export const start = ({ canvas, data, memory }) => {
  const regl = reglBuilder({
    canvas,
    attributes: { preserveDrawingBuffer: false },
  })

  const width = data.width()
  const height = data.height()
  console.log(new Uint8Array(memory.buffer, data.pixels(), width * height * 4))

  const draw = regl({
    blend: {
      enable: true,
      func: {
        srcRGB: 'src alpha',
        srcAlpha: 1,
        dstRGB: 'one minus src alpha',
        dstAlpha: 1,
      },
      equation: {
        rgb: 'add',
        alpha: 'add',
      },
      color: [0, 0, 0, 0],
    },
    frag,
    vert,
    uniforms: {
      t: ({ tick }) => tick,
      dataTexture: () =>
        regl.texture({
          width,
          height,
          data: new Uint8Array(
            memory.buffer,
            data.pixels(),
            width * height * 4
          ),
        }),
      resolution: ({ viewportWidth, viewportHeight }) => [
        viewportWidth,
        viewportHeight,
      ],
      dpi: window.devicePixelRatio * 2,
    },
    attributes: {
      position: [
        [-1, 4],
        [-1, -1],
        [4, -1],
      ],
    },
    count: 3,
  })

  return () => {
    regl.poll()
    draw()
  }
}

export const renderLoop = ({ data, memory, canvas }) => {
  const render = start({ data, canvas, memory })

  const loop = () => {
    render()
    requestAnimationFrame(loop)
  }
  loop()
}
