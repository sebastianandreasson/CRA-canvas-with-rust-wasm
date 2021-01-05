const path = require('path')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')

module.exports = function override(config, env) {
  config.resolve.extensions.push('.wasm')

  config.module.rules = [
    ...config.module.rules.map((rule) => {
      if (!rule.oneOf) {
        return rule
      }
      rule.oneOf = [
        ...rule.oneOf.slice(0, -1),
        {
          test: /\.(glsl|frag|vert)$/,
          exclude: [/node_modules/],
          use: ['raw-loader', 'glslify-loader'],
        },
        ...rule.oneOf.slice(-1),
      ]

      return rule
    }),
  ]

  config.module.rules.forEach((rule) => {
    ;(rule.oneOf || []).forEach((oneOf) => {
      if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
        // Make file-loader ignore WASM files
        oneOf.exclude.push(/\.wasm$/)
        oneOf.exclude.push(/\.(glsl|frag|vert)$/)
      }
    })
  })

  config.plugins = (config.plugins || []).concat([
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, './src/cargo'),
      extraArgs: '--no-typescript',
      outDir: path.resolve(__dirname, './src/cargo/build'),
    }),
  ])

  return config
}
