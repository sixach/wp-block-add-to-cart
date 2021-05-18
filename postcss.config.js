module.exports = {
	plugins: {
		'postcss-selector-replace': {
			before: [ '[prefix]' ],
			after: [ 'sixa' ],
		},
		'postcss-nested-ancestors': {},
		'postcss-nested': {},
		autoprefixer: {},
	},
};
