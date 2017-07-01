var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var isProd = process.env.NODE_ENV === 'production'

module.exports = {
  output: {
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: isProd,
          preserveWhitespace: false,
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        use: isProd
          ? ExtractTextPlugin.extract({
            use: 'css-loader?minimize',
            fallback: 'vue-style-loader'
          })
          : ['vue-style-loader', 'css-loader']
      },
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  devtool: '#eval-source-map',
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = 'none'
  module.exports.plugins = (module.exports.plugins || [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ExtractTextPlugin({
      filename: '[name].css?[hash]'
    }),
  ])
}