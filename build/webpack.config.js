const path = require("path");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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
      "ng2-bootstrap",
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
            publicPath: "dist/assets/",
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
    new ForkTsCheckerWebpackPlugin()
  ],
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, "../assets"),
    },
    extensions: [".ts", ".tsx", ".js"]
  }
};
