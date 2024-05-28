const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  plugins: [
    // ...
    new CopyPlugin({
      patterns: [
        { from: 'src/index.html', to: '' },
        { from: 'src/assets', to: 'assets' },
      ],
    }),
  ],
};
