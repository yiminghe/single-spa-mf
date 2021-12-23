const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

function cap(s) {
  return s[0].toUpperCase() + s.slice(1);
}

module.exports = ({ dir, app, port, main }) => ({
  entry: `${dir}/src/entries/index`,
  cache: false,

  mode: 'development',
  devtool: 'source-map',

  optimization: {
    minimize: false,
  },

  devServer: {
    historyApiFallback: true,
    port,
  },

  output: {
    publicPath: 'auto',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            require.resolve('@babel/preset-react'),
            require.resolve('@babel/preset-typescript'),
          ],
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: `${app}App`,
      ...(main ? {} : {
        filename: `${app}Entry.js`,
        exposes: {
          main: `${dir}/src/${cap(app)}Page`,
        },
      }),
      shared: [
        'react',
        'react-dom',
        'styled-components',
        'react-router-dom',
        'single-spa-react',
      ],
    }),
    new HtmlWebpackPlugin({
      template: `${dir}/public/index.html`,
    }),
  ],
});
