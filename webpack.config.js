var path = require('path');

module.exports = {
  mode: 'development',
  entry: {
		public: './public/index.js'
	},
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build/'),
	},
	watch: true,
};
