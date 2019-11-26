const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
    EnvironmentPlugin,
} = require('webpack');
const plugins = [
        new EnvironmentPlugin({
            DATABASE_URL: 'https://townhalltestingsms.firebaseio.com',
            FIREBASE_API_KEY: 'AIzaSyCJncx2G6bUnecl4H2VHSBTDfRRxg7H5Fs',
            FIREBASE_AUTH_DOMAIN: 'townhalltestingsms.firebaseapp.com',
            MESSAGING_SENDER_ID: 86976100332,
            PROJECT_ID: 'townhalltestingsms',
            STORAGE_BUCKET: 'townhalltestingsms.appspot.com',
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            chunkFilename: '[id].css',
            filename: '[name].css',
            publicPath: '/',
        }),
    
    ]
module.exports = {
    entry: './src/package-main.js',
    plugins,
    output: {
        filename: 'bundle.js',
        library: 'thp-submission',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production',
    
    module: {
        rules: [
            {
            test: /\.(j)sx?$/,
            exclude: /(node_modules|build)/,
            use: [{
                    loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    },
            ],
        },
        {
            test: /\.(sa|sc|c)ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader',
            ],
        },
      {
          test: /\.less$/,
          use: [
              'style-loader',
              {
                  loader: "css-loader",
                  options: {
                      camelCase: true,
                      importLoaders: 1
                  }
              },
              {
                  loader: "less-loader",
                  options: {
                      javascriptEnabled: true,
                  }
              }
          ]
      },
        {
            test: /\.(jpg|jpeg|gif|png|tiff|svg)$/,
            exclude: /\.glyph.svg/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 6000,
                    name: 'images/[name].[ext]',
                },
            }, ],
        },
    
    ],
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"],
    },
    externals: {
        'react': 'commonjs react',
        'react-dom':'commonjs react-dom',
    }
};