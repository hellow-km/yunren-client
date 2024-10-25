const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development", // 或者 'production'
  entry: "./node_modules/webtorrent/index.js",
  output: {
    path: path.resolve(__dirname, "dist2"),
    filename: "webtorrent.js",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-syntax-import-attributes",
                { deprecatedAssertSyntax: true },
              ],
            ],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
  target: "node", // 指定目标为 Node.js 环境
  node: {
    __dirname: false,
    __filename: false,
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^fsctl$/,
    }),
  ],
};
