const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

var stylusLoader = ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader");

module.exports = {
    context: path.join(__dirname, 'views'),
    entry: {
        navbar: './partials/navbar/navbar.js',
        addQuest: './quest/addQuest.js',
        questPage: './quest/questPage.js',
        slider: './partials/slider/slider.js',
        authForm: './auth/authForm.js'
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.styl$/,
                loader: stylusLoader
            },
            {
                test: /(\.png$)|(\.jpg$)|(\.jpeg$)|(\.gif$)/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ],
    postcss: () => {
        return [autoprefixer];
    }
};
