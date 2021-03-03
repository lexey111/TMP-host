const webpack = require('webpack');
const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const externals = require('./build-externals');
const TMPConfig = require('./tmp-build-config');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const stats = {
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
	reasons: true,
	source: false,
	colors: true,
	timings: true,
	usedExports: false,
	version: true,
	warnings: true,
};

module.exports = (env, args) => {
	let isProduction = false;
	const isAnalyze = (process.env['npm_lifecycle_script'].indexOf('analyze') !== -1);

	if (args && args['mode'] === 'production') {
		isProduction = true;
	}

	if (isAnalyze) {
		console.log('ANALYZE MODE');
	}

	if (isProduction) {
		console.log('PRODUCTION BUILD');
	} else {
		console.log('DEVELOPMENT BUILD');
	}

	const sourcePath = path.join(__dirname, '../src');
	const outPath = path.join(__dirname, '../dist');

	const config = {
		context: sourcePath,
		entry: {
			app: './main.tsx'
		},
		output: {
			path: outPath,
			publicPath: '',
			filename: 'app.js',
			// chunkFilename: 'app_chunk.js'
			// filename: isProduction ? '[contenthash].js' : '[hash].js',
			// chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].[hash].js'
		},
		target: 'web',
		externals: {...externals},
		devtool: isProduction ? false : 'source-map',
		stats,
		resolve: {
			extensions: ['.js', '.ts', '.tsx'],
			mainFields: ['module', 'browser', 'main'],
			alias: {
				app: path.resolve(__dirname, 'src/app/'),
				TMPUILibrary: TMPConfig.UILibrary,
			}
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
						// 'style-loader',
						// {
						// 	loader: 'css-loader',
						// 	query: {
						// 		//modules: true,
						// 		sourceMap: !isProduction,
						// 		importLoaders: 1,
						// 	}
						// },
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
			new webpack.EnvironmentPlugin({
				NODE_ENV: isProduction ? 'production' : 'development', // use 'development' unless process.env.NODE_ENV is defined
				DEBUG: !isProduction
			}),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: isProduction ? TMPConfig.dist : TMPConfig.distDev,
						to: outPath,
					},
					{
						from: path.resolve('./src/assets/loader.js'), // any file
						to: path.resolve(outPath, 'scripts/tmp_core_environment.js'),
						transform() {
							return `// File was automatically generated at ${new Date()} 
if (!window.TmpCore || !window.TmpCore.environment) {
	throw new Error('Global windows.TmpCore object is not ready!');
}

// window.TmpCore.environment.servicesBundle = 'twf_services_bundle';
// window.TmpCore.environment.uiBundle = 'twf_ui_bundle';

window.TmpCore.environment.servicesBundle = '';
window.TmpCore.environment.uiBundle = '';
window.TmpCore.environment.subAppList = {};
window.TmpCore.environment.availableLocales = [];
window.TmpCore.environment.availableDictionaries = {};

console.log('Host environment ready');


`;
						}
					},

					// {
					// 	from: path.resolve('./../tmp-subapps/dist'),
					// 	to: path.join(outPath, 'sub-apps'),
					// },
					// {
					// 	from: path.resolve('./../tmp-i18n'),
					// 	to: path.join(outPath, 'i18n', 'data'),
					// },
					{
						from: path.resolve('./src/assets/index.html'),
						to: outPath,
					},
					{
						from: path.resolve('./src/assets/loader.js'),
						to: outPath,
					},
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

	if (isAnalyze) {
		config.plugins.push(new BundleAnalyzerPlugin())
	}

	if (isProduction) {
		config.optimization.minimize = true;
		config.optimization.minimizer = [
			new TerserPlugin(),
			new OptimizeCSSAssetsPlugin({}),
		]
	}

	return config;
};
