const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const polyfill = require("@babel/polyfill");

module.exports = {
    entry: ["@babel/polyfill", "./src/client/index.js"],
    module: {
        rules: [
            {
                test: /\.js$/,	
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
     },
     plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        })
    ]    
}