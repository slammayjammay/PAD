module.exports = {
  entry: './src/js/index.js',
  output: {
    path: __dirname + './dist/',
    publicPath: '/dist/',
    filename: 'built.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '*']
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: [/\.jsx?$/],
        exclude: /(node_modules)/,
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
};
