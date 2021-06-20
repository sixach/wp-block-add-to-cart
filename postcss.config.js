module.exports = {
	plugins: {
		'postcss-selector-replace': {
			before: [ '[prefix]' ],
			after: [ 'sixa' ],
		},
		'postcss-important-startstop': {},
		'postcss-nested-ancestors': {},
		'postcss-nested': {},
		autoprefixer: {},
	},
};
