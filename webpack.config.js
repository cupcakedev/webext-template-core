const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');

const productionConfig = {
    mode: 'production',
    entry: {
        index: `${__dirname}/src/index.ts`,
        'storage/storage': `${__dirname}/src/storage/storage.ts`,
        'storage/config': `${__dirname}/src/storage/config.ts`,
        'bridge/bgEvents': `${__dirname}/src/bridge/bgEvents.ts`,
        'bridge/tabsEvents': `${__dirname}/src/bridge/tabsEvents.ts`,
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'Core',
        umdNamedDefine: true,
        clean: true,
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(?:ico|gif|png|svg|jpg|jpeg)$/i,
                loader: 'url-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff(2)?|ttf|eo)$/,
                loader: 'url-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        plugins: [
            new TsconfigPathsPlugin({
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
            }),
        ],
    },
    plugins: [new EnvironmentPlugin(['EXTENSION_NAME_PREFIX'])],
    optimization: {
        minimize: false,
    },
};

const devConfig = {
    mode: 'development',
    plugins: [new BundleAnalyzerPlugin()],
};

module.exports = (env) => {
    if (env.development) {
        return merge(productionConfig, devConfig);
    }
    return productionConfig;
};
