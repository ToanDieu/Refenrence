const path = require("path");
const custom = require("../webpack.config.js");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = async ({ config, mode }) => {
  config.resolve.extensions = config.resolve.extensions.concat([".ts", ".tsx"]);
  config.resolve.modules = config.resolve.modules.concat([
    path.resolve(__dirname, "..", "src")
  ]);
  config.resolve.alias["@"] = path.resolve(__dirname, "..", "src");
  config.resolve.alias["react-dom"] = "@hot-loader/react-dom";

  return {
    ...config,
    devtool: "cheap-module-eval-source-map",
    module: { ...config.module, rules: custom.module.rules },
    plugins: [
      ...config.plugins,
      new webpack.NormalModuleReplacementPlugin(/\/lang\/zh-CN/, "./lang/en"),
      new MiniCssExtractPlugin({
        filename: "app.bundle.[contenthash].css"
      })
    ]
  };
};
