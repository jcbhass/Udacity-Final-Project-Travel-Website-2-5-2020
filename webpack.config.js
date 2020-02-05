const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/client/index.js',
    module: {
        rules: [
            {
                test: '/\.js$/',	//don’t need quotation marks. 
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
     }
    
}