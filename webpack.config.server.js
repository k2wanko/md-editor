var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
var VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

var isProd = process.env.NODE_ENV === 'production'

var base = require('./webpack.config.base')

module.exports = merge(base, {
  target: 'node',
  devtool: 'none',
  entry: './src/main.server.js',
  output: {
    path: path.resolve(__dirname, './functions/dist'),
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    alias: {
      'firebase-app': './firebase-app.server.js'
    }
  },
  externals: [Object.keys(require('./functions/package.json').dependencies)],
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRServerPlugin(),
  ],
})

if (isProd) {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new HtmlWebpackPlugin({
      filename: 'index.template.html',
      template: 'src/index.server.html',
      inject: false,
    })
  ])
}