

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

  const getStyleLoaders = (
    cssOptions,
  ) => {
    const loaders = [{
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            plugins: [
              require.resolve('autoprefixer'),
              require.resolve('tailwindcss'),
            ]
          },
          sourceMap: true,
        },
      },
    ].filter(Boolean);
    return loaders;
  };

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
        {
          test:  /\.css$/,
          use: getStyleLoaders({
            importLoaders: 1,
          }),
          sideEffects: true,
        },
      ],
    },

    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        publicPath:'/',
        template: `${dir}/public/index.html`,
      }),
      new WebpackManifestPlugin(),
      new ModuleFederationPlugin({
        ...mfWebpack.getMFAppConfig({ app }),
        ...(main ? {} : {
          exposes: {
            ...mfWebpack.getMFExposes(`${dir}/src/main/Main`),
          },
        }),
        shared: [
          'react',
          'react-dom',
          'react-router-dom',
          'single-spa-react',
        ],
      }),

    ],
  })
};
