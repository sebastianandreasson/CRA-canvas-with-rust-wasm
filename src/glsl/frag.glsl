precision highp float;
uniform sampler2D dataTexture;

varying vec2 uv;

void main() {
  vec2 coord = (uv * vec2(0.5, -0.5)) + vec2(0.5);
  vec4 data = texture2D(dataTexture, coord);

  gl_FragColor = vec4(data.r, data.g, data.b, data.a);
}