'use strict';
const webpack = require('webpack');
const devMode = process.env.NODE_ENV !== 'production';

const path = require('path');
const glob = require('glob-all');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    module: {
        rules: [
            {
                // Matches all PHP or JSON files in `resources/lang` directory.
                test: /admin\/resources[\\\/]lang.+\.(php|json)$/,
                loader: 'laravel-localization-loader',
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.s?[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { url: false, sourceMap: true, minimize: true } },
                    { loader: 'sass-loader', options: { sourceMap: true, minimize: true } }
                ],
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        removeComments: false,
                        collapseWhitespace: false,
                        attrs: ['data:src']
                    }
                }]
            },
            {
                test: /bootstrap\.native/,
                use: {
                    loader: 'bootstrap.native-loader',
                    options: {
                        only: ['modal']
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CleanWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),

        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
            canPrint: true
        })
    ],
    optimization: {
        minimizer: [
            new UglifyWebpackPlugin({ cache: true, parallel: 3 })
        ]
    },
    /*
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }*/
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
};
