module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    chunkFilename: '[name].bundle.js',
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
