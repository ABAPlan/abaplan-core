const path = require("path");

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// May be improved by selecting only the needed files
const copyWebpackPluginConfig = [
  'i18n/*.json',
  {
    from: 'assets/css/abaplans.css',
    to: 'css/abaplans.css',
  },
];

const htmlWebpackIncludeAssetsPluginConfig = {
  assets: [
    'css/abaplans.css',
    '//js.arcgis.com/3.20/esri/css/esri.css',
    '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
    '//code.jquery.com/jquery-3.3.1.min.js',
    '//js.arcgis.com/3.20/init.js',// must be after jquery
  ],
  append: false
};

const HtmlWebpackPluginConfig = {
  meta: {
    viewport: 'width=device-width, initial-scale=1',
  },
  template: path.resolve(__dirname, "../src/index.html"),
  inject: 'head',
  chunks: [],
};

module.exports = {
  entry: {
    main: ["./src/app/boot.ts"],
    vendor: [
      // put your third party libs here
      "@angular/common",
      "@angular/compiler",
      "@angular/core",
      "@angular/http",
      "@angular/platform-browser",
      "@angular/platform-browser-dynamic",
      "@angular/router",
      "angular-in-memory-web-api",
      "core-js",
      "ngx-bootstrap",
      "rxjs",
      "zone.js"
    ]
  },
  externals: [
    function(context, request, callback) {
      if (
        /^dojo/.test(request) ||
        /^dojox/.test(request) ||
        /^dijit/.test(request) ||
        /^esri/.test(request)
      ) {
        return callback(null, "amd " + request);
      }
      callback();
    }
  ],
  module: {
    rules: [
      {
        test: /\.(gif|png)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: "assets/",
            publicPath: "assets/",
          }
        }
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
            }
          },
          {
            loader: "angular2-template-loader",
          }
        ],
      },
      {
        test: /\.(html|css)$/,
        loaders: "raw-loader"
      },
    ]
  },
  output: {
    filename: "[name].bundle.js",
    libraryTarget: "amd", // necessary for esri (arcgis)
    path: path.resolve(__dirname, "../dist"),
  },
  plugins: [
    new CopyWebpackPlugin(copyWebpackPluginConfig),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin(HtmlWebpackPluginConfig),
    new HtmlWebpackIncludeAssetsPlugin(htmlWebpackIncludeAssetsPluginConfig),
  ],
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, "../assets"),
    },
    extensions: [".ts", ".tsx", ".js"]
  }
};
