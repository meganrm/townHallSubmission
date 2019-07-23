require('dotenv').config();
const path = require('path');
const fs = require('fs');
const lessToJs = require('less-vars-to-js');
const {
  EnvironmentPlugin,
} = require('webpack');

const devMode = process.env.NODE_ENV !== 'production';
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './src/styles/ant-vars.less'), 'utf8'));
const HTMLPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const { ProvidePlugin } = require('webpack');

const plugins = [
  new EnvironmentPlugin({
    DATABASE_URL: 'https://townhalltestingsms.firebaseio.com',
    FIREBASE_API_KEY: 'AIzaSyCJncx2G6bUnecl4H2VHSBTDfRRxg7H5Fs',
    FIREBASE_AUTH_DOMAIN: 'townhalltestingsms.firebaseapp.com',
    MESSAGING_SENDER_ID: 86976100332,
    PROJECT_ID: 'townhalltestingsms',
    STORAGE_BUCKET: 'townhalltestingsms.appspot.com',
  }),
  new ProvidePlugin({
    jQuery: 'jquery',
    $: 'jquery',
    jquery: 'jquery',
  }),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    chunkFilename: '[id].css',
    filename: '[name].css',
  }),

  new HTMLPlugin({
    template: `${__dirname}/src/index.html`,
  }),
  // new ExtractPlugin('bundle.[hash].css'),
  new CopyWebpackPlugin([
    {
      flatten: true,
      from: 'src/assets/downloads/*.pdf',
      to: 'downloads',
    },
    // {
    //   from: 'src/CNAME',
    // },
    {
      flatten: true,
      from: 'src/assets/images',
      to: 'images',
    },
  ]),
];

module.exports = {
  mode: 'development',

  plugins,
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  },

  // Load this and everything it cares about
  entry: `${__dirname}/src/main.js`,

  devtool: 'source-map',

  // Stick it into the "path" folder with that file name
  output: {
    filename: 'bundle.[hash].js',
    path: `${__dirname}/build`,
  },
  module: {
    rules: [
      // If it's a .js file not in node_modules, use the babel-loader
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.js|.jsx?$/,
        options: {
          plugins: [
            ['import', { libraryName: 'antd', style: true }],
          ],
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [

          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: themeVariables,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot|glyph|\.svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'font/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(jpg|jpeg|gif|png|tiff|svg)$/,
        exclude: /\.glyph.svg/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 6000,
              name: 'images/[name].[ext]',
            },
          },
        ],
      },

    ],
  },
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
  },

};
