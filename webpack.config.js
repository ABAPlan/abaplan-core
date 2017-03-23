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
        ],
        pure: [
            './app/shared/pagination/paginate.purs'
        ]
    },
    output: {
        filename: 'dist/[name].bundle.js',
        libraryTarget: "amd"
    },
    resolve: {
    modulesDirectories: [ 'node_modules', 'bower_components' ],
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.html', '.purs']
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: ['ts-loader', 'angular2-template-loader'],
            },
            {
                test: /\.(html|css)$/,
                loader: 'raw-loader'
            },
            {
                test: /\.purs$/,
                loader: 'purs-loader',
                exclude: /node_modules/,
                query: {
                    src: [ 'bower_components/purescript-*/src/**/*.purs', 'app/**/*.purs' ],
                    bundle: false,
                    psc: 'psc',
                    pscIde: false
                }
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
