const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const TMPCorePath = 'node_modules/tmp-core';
const TMPConfigFile = path.resolve(`${TMPCorePath}/src/core/@exports/build-environment.js`);

let isComposerMode = false;
let composerSettings;
if (process.env['npm_lifecycle_event'].indexOf('composer') !== -1) {
	isComposerMode = true;
	console.log('***************************');
	console.log('**     COMPOSER MODE     **');
	console.log('***************************');
	composerSettings = require('../config/composer.config');
	console.log('URL:', composerSettings.url);
	console.log('');
}

const SubAppsBase = './../subapps';

console.log(`Configure TMP-core as ${TMPCorePath}`);
console.log(`Configure TMP-core config as ${TMPConfigFile}`);

if (!isComposerMode) {
	console.log(`Configure sub-apps base as ${SubAppsBase}`);
}

if (!fs.existsSync(path.resolve(TMPCorePath))) {
	throw new Error('TMP Core folder not found!');
}

if (!fs.existsSync(TMPConfigFile)) {
	throw new Error('TMP Core config file not found!');
}

if (!isComposerMode && !fs.existsSync(path.resolve(SubAppsBase))) {
	throw new Error('Sub-apps folder not found!');
}

console.log('Run Core environment preparation...');
const TMPConfig = require(TMPConfigFile)(TMPCorePath);

module.exports = (env, args) => {
	let isProduction = false;
	if (args && args['mode'] === 'production') {
		isProduction = true;
	}

	if (isProduction) {
		console.log('PRODUCTION BUILD');
	} else {
		console.log('DEVELOPMENT BUILD');
	}

	const sourcePath = path.join(__dirname, '../src');
	const outPath = path.join(__dirname, '../dist');

	const subAppListForManager = {};
	const AppsPatterns = [];

	// prepare pre-defined subapps config to copy
	if (!isComposerMode) {
		console.log('');
		console.log('Prepare sub-apps...');
		console.log('===================');
		const subAppListToCopy = require('../config/subapps.config');

		for (const [app, content] of Object.entries(subAppListToCopy)) {
			console.log((content.online ? 'Online' : 'Local') + ' sub-app registered:', app);
			console.log('Content', content);

			if (!content.online) {
				const folder = path.resolve(SubAppsBase, content.dist);

				if (!fs.existsSync(folder)) {
					throw new Error(`Output folder for sub-app ${app} not found at ${folder} with base ${SubAppsBase}!`)
				}

				AppsPatterns.push({
					from: path.resolve(folder, content.entry),
					to: path.resolve(outPath, 'scripts/subapps/' + content.entry),
					noErrorOnMissing: true,
				});

				if (!isProduction) {
					AppsPatterns.push({
						from: path.resolve(folder, content.entry + '.map'),
						to: path.resolve(outPath, 'scripts/subapps/' + content.entry + '.map'),
						noErrorOnMissing: true,
					});
				}

				if (content.styles) {
					AppsPatterns.push({
						from: path.resolve(folder, content.styles),
						to: path.resolve(outPath, 'styles/subapps/' + content.styles),
						noErrorOnMissing: true,
					});
				}
			}

			subAppListForManager[app] = {
				online: content.online || false,
				loaded: !content.online,
				available: content.online ? null : true,
				path: content.online ? '' : '/scripts/subapps/',
				homeCard: content.homeCard,
				bundle: content.entry,
				appName: app,
				title: content.name,
				stylesheet: (content.online ? '' : '/styles/subapps/') + content.styles || '',
				routes: [...(content.routes ? content.routes : [])]
			};
		}
		console.log('===================');
		console.log('');
	}

	const config = {
		context: sourcePath,
		entry: {
			app: './main.tsx',
			'scripts/tmp_core_environment': './tmp_core_environment.ts'
		},
		output: {
			path: outPath,
			publicPath: '',
			filename: '[name].js',
		},
		target: 'web',
		externals: TMPConfig.build.externals,
		devtool: isProduction ? false : 'source-map',
		stats: {
			assets: true,
			cached: false,
			cachedAssets: false,
			children: false,
			chunks: false,
			chunkModules: false,
			env: true,
			chunkOrigins: false,
			depth: false,
			entrypoints: true,
			errors: true,
			errorDetails: true,
			hash: false,
			modules: true,
			moduleTrace: false,
			performance: false,
			providedExports: false,
			publicPath: false,
			reasons: false,
			source: false,
			colors: true,
			timings: true,
			usedExports: false,
			version: true,
			warnings: true,
		},
		resolve: {
			extensions: ['.js', '.ts', '.tsx'],
			mainFields: ['module', 'browser', 'main'],
			alias: {
				// app: path.resolve(__dirname, 'src/app/'),
				TMPUILibrary: TMPConfig.paths.UILibrary,
				...TMPConfig.paths.lessFiles
			},
		},
		module: {
			rules: [
				{
					test: /\.(ts|tsx)$/,
					// eslint
					enforce: 'pre',
					use: [
						{
							options: {
								eslintPath: require.resolve('eslint'),
							},
							loader: require.resolve('eslint-loader'),
						},
					],
					exclude: /node_modules/,
				},
				{
					test: /\.tsx?$/,
					exclude: /.*-jest\.tsx?/,
					use: [
						{
							loader: 'ts-loader',
							options: {
								transpileOnly: true,
								silent: false,
								configFile: path.resolve('./tsconfig.json')
							},
						}
					]
				},
				// css
				{
					test: /.(le|c)ss$/i,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: `[name].css`
							}
						},
						{
							loader: 'less-loader',
						}
					]
				},
				// static assets
				{
					test: /\.html$/,
					use: 'html-loader'
				},
				{
					test: /\.(a?png|svg)$/,
					use: 'url-loader?limit=10000'
				},
				{
					test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
					use: 'file-loader'
				}
			]
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					default: {
						minChunks: 1,
						priority: -20,
						reuseExistingChunk: true
					}
				},
			},
			runtimeChunk: false,
		},
		plugins: [
			new webpack.DefinePlugin({
				SUBAPPS: JSON.stringify(subAppListForManager),
				PRODUCTION: JSON.stringify(isProduction),
				IS_COMPOSER: JSON.stringify(isComposerMode),
				COMPOSER: JSON.stringify(composerSettings),
			}),
			new webpack.EnvironmentPlugin({
				NODE_ENV: isProduction ? 'production' : 'development', // use 'development' unless process.env.NODE_ENV is defined
				DEBUG: !isProduction,
			}),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: isProduction ? TMPConfig.paths.dist : TMPConfig.paths.distDev,
						to: outPath,
					},
					{
						from: path.resolve('./src/assets/index.html'),
						to: outPath,
					},
					{
						from: path.resolve('./src/assets/loader.js'),
						to: outPath,
					},
					{
						from: path.resolve('./src/assets/online-health.js'),
						to: outPath,
					},
					{
						from: path.resolve('./src/assets/i18n'),
						to: outPath + '/i18n',
						toType: 'dir'
					},
					...AppsPatterns
				]
			}),
		],
		watchOptions: {
			aggregateTimeout: 100,
			ignored: /node_modules/,
			poll: 300
		},
		devServer: {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			historyApiFallback: true,
			compress: false,
			port: 3030,
			contentBase: outPath,
			hot: true,
			inline: true,
			stats: 'minimal',
			clientLogLevel: 'warning'
		}
	};

	if (isProduction) {
		config.optimization.minimize = true;
		config.optimization.minimizer = [
			new TerserPlugin(),
			new OptimizeCSSAssetsPlugin({}),
		]
	}

	return config;
};
