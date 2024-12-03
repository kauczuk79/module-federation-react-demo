const { FederatedTypesPlugin } = require('@module-federation/typescript');

const HtmlWebPackPlugin = require("html-webpack-plugin");
const {ModuleFederationPlugin} = require("webpack").container;
const path = require("path");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./public/index.html",
  filename: "./index.html"
});
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const moduleFederationConfig = {
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
    },
    'firebase': {
      singleton: true
    }
  },

};
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
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    htmlPlugin,
    new ModuleFederationPlugin(moduleFederationConfig),
    new FederatedTypesPlugin({ federationConfig: moduleFederationConfig, typeFetchOptions: {
      maxRetryAttempts: 1
    } })
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   generateStatsFile: true,
    //   statsOptions: { source: false }
    // })
  ]
};