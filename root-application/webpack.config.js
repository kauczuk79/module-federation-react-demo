const HtmlWebPackPlugin = require("html-webpack-plugin");
const {ModuleFederationPlugin} = require("webpack").container;
const path = require("path");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./public/index.html",
  filename: "./index.html"
});
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  mode: 'development',
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3000,
    historyApiFallback:{
      index:'/public/index.html'
    },
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    }
    ]
  },
  plugins: [
    htmlPlugin,
    new ModuleFederationPlugin({
      name: "RootApplication",
      filename: "RootApplicationModule.js",
      remotes: {
        MicroFrontend1: "MicroFrontend1@http://localhost:3001/MicroFrontend1Module.js"
      },
      shared: {
        react: {
          singleton: true
        },
        'react-dom': {
          singleton: true
        }
      }
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   generateStatsFile: true,
    //   statsOptions: { source: false }
    // })
  ]
};
