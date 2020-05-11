//import node modules
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    //entry = raw js
    entry : ['babel-polyfill','./src/js/index.js'],
    output : {
        //__dirname = current absolut path variable
        path : path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer : {
        contentBase : './dist'
    },
    plugins : [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module : {
        rules : [
            {
                test : /\.js$/,
                exclude : /node_modules/,
                use : {
                    loader : 'babel-loader'
                }
            }
        ]
    }
}