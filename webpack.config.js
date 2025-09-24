const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    main: "./src/index.ts", // existing storefront bundle
    demosite: "./src/store_scripts/DemoSite/index.ts", // ✅ your chatbot init lives here
  },
  module: {
    rules: [
      { test: /\.ts?$/, use: "ts-loader", exclude: /node_modules/ },
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
    ],
  },
  resolve: { extensions: [".tsx", ".ts", ".js"] },
  output: {
    filename: "[name].js", // emits main.js AND demosite.js
    chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"), // match where you upload
    publicPath: "auto",
    clean: true,
  },
  optimization: {
    splitChunks: { chunks: "all" },
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/index.html", to: "" },
        { from: "src/assets", to: "assets" },
      ],
    }),
  ],
};
