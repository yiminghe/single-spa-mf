

function cap(s) {
  return s[0].toUpperCase() + s.slice(1);
}

const isEnvProduction = !!process.env.BUILD;
const hash = true;

module.exports = ({ dir, app, port, main, require }) => {
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { ModuleFederationPlugin } = require('webpack').container;
  const mfWebpack = require('single-spa-mf/webpack');
  const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
  return ({
    entry: `${dir}/src/entries/index`,

    mode: 'development',
    devtool: 'source-map',

    optimization: {
      minimize: false,
    },



    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      historyApiFallback: true,
      port,
    },

    output: {
      filename: isEnvProduction
        ? `static/js/[name]${hash ? '.[contenthash:8]' : ''}.js`
        : 'static/js/[name].js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction
        ? `static/js/[name]${hash ? '.[contenthash:8]' : ''}.chunk.js`
        : 'static/js/[name].chunk.js',
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
      new HtmlWebpackPlugin({
        publicPath:'/',
        template: `${dir}/public/index.html`,
      }),
      new WebpackManifestPlugin(),
      new ModuleFederationPlugin({
        ...mfWebpack.getMFAppConfig({ app }),
        ...(main ? {} : {
          exposes: {
            ...mfWebpack.getMFExposes(`${dir}/src/${cap(app)}Page`),
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

    ],
  })
};
