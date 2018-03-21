const path = require("path");

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
        test: /\.tsx?$/,
        loaders: ["ts-loader", "angular2-template-loader"]
      },
      {
        test: /\.(html|css)$/,
        loaders: "raw-loader"
      }
    ]
  },
  output: {
    filename: "[name].bundle.js",
    libraryTarget: "amd", // necessary for esri (arcgis)
    path: path.resolve(__dirname, "../dist")
  },
  resolve: {
    extensions: ["*", ".ts", ".tsx", ".js"]
  }
};
