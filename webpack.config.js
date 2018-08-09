require('dotenv').config();
const webpack = require('webpack');
// Dynamic Script and Style Tags
const HTMLPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { EnvironmentPlugin } = require('webpack');

const plugins = [
  new webpack.ProvidePlugin({
    jQuery: 'jquery',
    $: 'jquery',
    jquery: 'jquery'
  }),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].css",
    chunkFilename: "[id].css"
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

  // Load this and everythning it cares about
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
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
       {
         test: /\.css$/,
         use: [
           MiniCssExtractPlugin.loader,
           "css-loader"
         ]
       },
      // If it's a .scss file
      {
        test: /\.scss$/,
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
      },
      {
          test: /\.less$/,
            use: [{
                loader: "style-loader"
              },
              {
                loader: "css-loader"
              },
              {
                loader: "less-loader"
              }
            ]
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
  },

};
