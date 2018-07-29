var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        main: './index',
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".ts"]
    },
    output: {
        publicPath: ".",
        path: path.join(__dirname, '../app/assets/javascripts'),
        filename: 'ajax_canvas_field.js',
        library: 'AjaxCanvasField',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    }
};
