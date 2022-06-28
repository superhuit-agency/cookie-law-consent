const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	stats: 'minimal',
  entry: {
		['cookie-law-consent']: './public/index.js',
		['cookie-law-consent-admin']: './admin/src/index.js'
	},
  output: {
    filename: '[name].[hash:8].js',
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
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: [
        '**/*',
        '!index.html',
    	],
		}),
		new WebpackManifestPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].[hash:8].css',
      chunkFilename: '[id].[hash:8].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
	],
	devServer: {
    contentBase: './build',
  },
};
