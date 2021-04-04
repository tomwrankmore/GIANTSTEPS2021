const { merge } = require('webpack-merge');
const common = require('../webpack.common.js');
const environment = require('./environment');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: environment.paths.output,
        compress: false,
        port: 9000,
        watchContentBase: true,
        // publicPath: '/',
        hot: false,
        liveReload: true
      },
      // watchOptions: {
      //   aggregateTimeout: 300,
      //   poll: 300,
      //   ignored: /node_modules/,
      // },
  });
