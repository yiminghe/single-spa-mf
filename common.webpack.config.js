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
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const { resolve: r } = require;

  const cssOptions = {
    attributes: {
      'data-app': app,
    },
    filename: `[name]${hash ? '.[contenthash:8]' : ''}.css`,
  };
  if (!main) {
    cssOptions.insert = function (linkTag) {
      if (window.__addMFLink) {
        window.__addMFLink(linkTag);
      } else {
        document.head.appendChild(linkTag);
      }
    };
  }

  const getStyleLoaders = (cssOptions) => {
    const loaders = [
      {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: r('css-loader'),
        options: cssOptions,
      },
      {
        loader: r('postcss-loader'),
        options: {
          postcssOptions: {
            ident: 'postcss',
            plugins: [r('autoprefixer'), r('tailwindcss')],
          },
          sourceMap: true,
        },
      },
    ].filter(Boolean);
    return loaders;
  };

  return {
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
          exclude: /(node_modules)/,
          use: {
            // `.swcrc` can be used to configure swc
            loader: r('swc-loader'),
          },
        },
        {
          test: /\.css$/,
          use: getStyleLoaders({
            importLoaders: 1,
          }),
          sideEffects: true,
        },
      ],
    },

    plugins: [
      new MiniCssExtractPlugin(cssOptions),
      new HtmlWebpackPlugin({
        publicPath: '/',
        template: `${dir}/public/index.html`,
      }),
      new WebpackManifestPlugin(),
      new ModuleFederationPlugin({
        ...mfWebpack.getMFAppConfig({ app }),
        ...(main
          ? {}
          : {
              exposes: {
                ...mfWebpack.getMFExposes(`${dir}/src/main/Main`),
              },
            }),
        shared: ['react', 'react-dom', 'react-router-dom', 'single-spa-react'],
      }),
    ],
  };
};
