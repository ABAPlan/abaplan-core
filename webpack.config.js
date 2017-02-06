var webpack = require("webpack");

module.exports = {
    entry: {
        main: [
            './app/boot.ts' // entry point for your application code
        ],
        vendor: [
            // put your third party libs here
            "core-js",
            "rxjs",
            "zone.js",
            '@angular/core',
            '@angular/common',
            "@angular/compiler",
            "@angular/core",
            "@angular/http",
            "@angular/platform-browser",
            "@angular/platform-browser-dynamic",
            "@angular/router",
            "angular-in-memory-web-api",
            "ng2-bootstrap"
        ]
    },
    output: {
        filename: 'dist/[name].bundle.js',
        libraryTarget: "amd"
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.html']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['ts-loader', 'angular2-template-loader'],
                exclude: [/\.(spec|e2e)\.ts$/]
            },
            {
                test: /\.(html|css)$/,
                loader: 'raw-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        })
    ],
    externals: [
        function(context, request, callback) {
            if (/^dojo/.test(request) ||
                /^dojox/.test(request) ||
                /^dijit/.test(request) ||
                /^esri/.test(request)
            ) {
                return callback(null, "amd " + request);
            }
            callback();
        }
    ],
    debug: true,
    devtool: 'source-map'
};
