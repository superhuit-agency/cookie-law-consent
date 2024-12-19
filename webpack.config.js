const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
	mode: isProd ? "production" : "development",
	stats: "minimal",
	entry: {
		["cookie-law-consent"]: "./src/public/index.js",
		["cookie-law-consent-admin"]: "./src/admin/assets/index.js",
	},
	output: {
		filename: isProd ? "[name].[contenthash:8].js" : "[name].js",
		path: path.resolve(__dirname, "dist/"),
		clean: true,
		publicPath: "",
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/i,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: {
					babelrc: false,
					presets: [["@babel/preset-env"]],
				},
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: "css-loader", // translates CSS into CommonJS
					},
					{
						loader: "sass-loader", // compiles Sass to CSS
					},
				],
			},
		],
	},
	plugins: [
		new WebpackManifestPlugin(),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// all options are optional
			filename: isProd ? "[name].[contenthash:8].css" : "[name].css",
			chunkFilename: isProd ? "[id].[contenthash:8].css" : "[id].css",
			ignoreOrder: false, // Enable to remove warnings about conflicting order
		}),
	],
	devServer: {
		static: {
			directory: path.join(__dirname, "public"),
		},
	},
};
