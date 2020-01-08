---
date: 2017-07-31
title: "webpack: Building React For Production on Windows"
thumbnail: "../thumbnails/webpack.png"
slug: webpack-build-react-production-windows
template: post
categories:
  - Toolchain

tags:
  - webpack
  - windows
---

I ran into some unexpected errors while trying to build React for production using a Windows machine _(which was undocumented in the React docs. No love for Windows machines? =p)_.

The below is just some documentation of my research for personal reference.

## Mac OS: Package.json webpack Build Script

The <a href='https://facebook.github.io/react/docs/optimizing-performance.html#webpack' target='_blank'>React docs</a> provide the following script:

<div class="filename">package.json</div>

```json
  "scripts": {
    "build": "NODE_ENV='production' webpack -p"
  }
```

## Windows: Package.json webpack Build Script

However, trying to run the above script on a Windows machine (even using cygwin) will give you the error:

```terminal
'NODE_ENV' is not recognized as an internal or external command, operable program or batch file.
```

The script needs to be run slightly differently on Windows machines:

<div class="filename">package.json</div>

```json
  "scripts": {
    "build": "set NODE_ENV=production && webpack -p"
  }
```

## Understanding The Scripts

### 1. `package.json`: Optimizing webpack for Production

The <a href='https://webpack.github.io/docs/cli.html#production-shortcut-p' target='_blank'>webpack production flag</a> `webpack -p` is shorthand for `--optimize-minimize --optimize-occurrence-order`.

`--optimize-minimize`: Minimize scripts and CSS (if using css-loader).

`--optimize-occurrence-order`: webpack assigns IDs to modules and chunks (I believe for caching validation purposes). `--optimize-occurrence-order` makes sure that commonly used ids will have a smaller id length.

<div class="filename">package.json</div>

```json
// Set NODE_ENV for webpack to 'production'
// Use the webpack 'production' shortcut, -p
  "scripts": {
    "build": "set NODE_ENV=production && webpack -p"
  }
```

### 2. `webpack.config.js`: Build React for Production and Minify JS

In webpack, `DefinePlugin`,<a href='https://webpack.js.org/plugins/define-plugin/' target='_blank'>allows creating global constants</a> that can be configured at compile time. This provides flexibility for different behaviors between development builds and release builds.

### Tell React to use the <a href='https://facebook.github.io/react/docs/optimizing-performance.html' target='_blank'>production version of React</a>

This instance of `DefinePlugin` <a href='https://webpack.js.org/guides/production/#node-environment-variable' target='_blank'>performs a search-and-replace on the original source code</a>, and instances of `process.env.NODE_ENV` in the imported code is replaced by `"production"`.

React's internals has references to `process.env.NODE_ENV`. When set to, `"production"`, React removes warning messages to reduce file-size and increase performance.

<div class="filename">webpack.config.js</div>

```js
new webpack.DefinePlugin({
  "process.env.NODE_ENV": JSON.stringify("production")
});
```

### Make webpack Minify Javascript code

webpack comes with UglifyJsPlugin, and uses UglifyJS to minimize the output.

<div class="filename">webpack.config.js</div>

```js
new webpack.optimize.UglifyJsPlugin();
```

## Complete webpack.config.js

<div class="filename">webpack.config.js</div>

```js
let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let webpack = require("webpack");

let config = {
  entry: "./app/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.bundle.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader"
      },
      {
        exclude: /(node_modules)/,
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "app/index.html"
    })
  ]
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new webpack.optimize.UglifyJsPlugin()
  );
}

module.exports = config;
```
