const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: "./src/entries/index",
  cache: false,

  mode: "development",
  devtool: "source-map",

  optimization: {
    minimize: false
  },


  output: {
    publicPath: "auto"
  },

  devServer: {
    historyApiFallback: true,
    port: 3001,
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        loader: require.resolve("babel-loader"),
        options: {
          presets: [
            require.resolve("@babel/preset-typescript"),
            require.resolve("@babel/preset-react"),
          ]
        }
      }
    ]
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "main-app",
      shared: [
        'react',
        'react-dom',
        'styled-components',
        'react-router-dom',
        'single-spa-react',
      ]
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ]
};