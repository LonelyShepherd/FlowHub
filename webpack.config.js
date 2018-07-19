const path = require('path');
const dist = path.resolve(__dirname, './dist/');

module.exports = {
  entry: [
  	'./src/js/main.js', 
  	'./src/scss/main.scss'
	],
  output: {
      path: dist,
      filename: 'js/main.js'
  },
  mode: 'production',
  watch: true,
  module: {
	  rules: [
	    {
	      test: /\.js$/,
	      exclude: /(node_modules|bower_components)/,
	      use: {
	        loader: 'babel-loader',
	        options: {
	          presets: ['babel-preset-env']
	        }
	      }
	    }, 
	    {
	    	test: /\.scss$/,
	    	use: [
	    		{
	    			loader: 'file-loader',
	    			options: {
	    				name: '[name].css',
	    				context: dist,
	    				outputPath: 'css/'
	    			},
	    		},
    			{
						loader: 'extract-loader'
					},
					{
						loader: 'css-loader',
						options: {
                sourceMap: true,
                minimize: true
            }
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
	    	]
	    },
	  ]
	}
}
