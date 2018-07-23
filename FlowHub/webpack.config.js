const path = require('path');
const dist = path.resolve(__dirname, './dist/');

const scssFilename = 'main';
const jsFilename = 'adapt';

module.exports = {
  entry: [
    './src/js/' + jsFilename + '.js',
    './src/scss/' + scssFilename + '.scss'
  ],
  output: {
    path: dist,
    filename: 'js/' + jsFilename + '.js'
  },
  mode: 'production',
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)|bower_components/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: scssFilename + '.css',
              context: dist,
              outputPath: 'css/'
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
}