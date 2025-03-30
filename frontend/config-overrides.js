const path = require('path')

module.exports = function override(config) {
	config.resolve.alias = {
		...config.resolve.alias,
		'@': path.resolve(__dirname, 'src'),
	}

	config.cache = {
		type: 'filesystem',
		cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'),
		buildDependencies: {
			config: [__filename],
		},
	}

	const babelLoader = config.module.rules.find(rule =>
		rule.oneOf?.some(r => r.loader?.includes('babel-loader')),
	)
	if (babelLoader) {
		babelLoader.oneOf.forEach(r => {
			if (r.loader?.includes('babel-loader')) {
				r.options.cacheDirectory = true
			}
		})
	}

	return config
}
