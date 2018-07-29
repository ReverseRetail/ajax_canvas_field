var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'cheap-source-map',
    entry: {
        main: './index',
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".ts"]
    },
    output: {
        publicPath: ".",
        path: path.join(__dirname, '../app/assets/javascripts'),
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
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
