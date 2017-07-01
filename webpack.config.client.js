var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

var isProd = process.env.NODE_ENV === 'production'

var base = require('./webpack.config.base')

module.exports = merge(base, {
  entry: './src/main.client.js',
  output: {
    path: path.resolve(__dirname, './functions/public'),
    filename: 'build.js?[hash]'
  },
  resolve: {
    alias: {
      'firebase-app': './firebase-app.client.js'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'main',
      minChunks: function (module) {
        return (
          /node_modules/.test(module.context) &&
          !/\.css\?[a-z0-9]$/.test(module.request)
        )
      }
    }),
    new VueSSRClientPlugin(),
  ],
})

if (!isProd) {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.client.html',
    })
  ])
} 
