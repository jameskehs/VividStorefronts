// webpack.config.js
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production", // use "development" for local debugging
  entry: "./src/index.ts",

  output: {
    filename: "bundle.js", // fixed name so your HTML can reference it
    chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true, // wipe old build artifacts
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // Optional: allow importing images/fonts via asset modules
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf)$/i,
        type: "asset",
      },
    ],
  },

  devtool: "source-map",

  optimization: {
    splitChunks: { chunks: "all" },
    minimize: true, // production already minimizes, but this keeps your explicit plugin
    minimizer: [new TerserPlugin()],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/index.html", to: "" }, // copied to build/index.html
        { from: "src/assets", to: "assets", noErrorOnMissing: true },
      ],
    }),
  ],

  // Optional: local preview at http://localhost:5173
  devServer: {
    static: { directory: path.resolve(__dirname, "build") },
    port: 5173,
    open: false,
    compress: true,
    client: { logging: "info" },
  },
};
