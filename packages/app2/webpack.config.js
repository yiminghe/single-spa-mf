
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

  devServer: {
    historyApiFallback: true,
    port: 3003,
  },

  output: {
    publicPath: "auto"
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
          presets: [require.resolve("@babel/preset-react"),
          require.resolve("@babel/preset-typescript")]
        }
      }
    ]
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "app2App",
      filename: "app2Entry.js",
      exposes: {
        "main": "./src/App2Page",
      },
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