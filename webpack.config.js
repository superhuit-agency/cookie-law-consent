const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
		['cookie-law-consent']: './public/index.js'
	},
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build/'),
	},
	module: {
    rules: [
			{
				test: /\.jsx?$/i,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					babelrc: false,
					presets: [
						['@babel/preset-env']
					]
				}
			},
      {
        test: /\.s[ac]ss$/i,
        use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ],
      },
    ],
	},
	plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: 'cookie-law-consent.css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  ],
};
