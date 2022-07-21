const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { EnvironmentPlugin, WatchIgnorePlugin } = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');

const prodConfig = {
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
    externals: {
        react: 'react',
        reactDOM: 'react-dom',
        reactIs: 'react-is',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        compiler: 'ttypescript',
                    },
                },
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
    plugins: [
        new EnvironmentPlugin(['EXTENSION_NAME_PREFIX']),
        new WatchIgnorePlugin({
            paths: [/\.js$/, /\.d\.ts$/],
        }),
    ],
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
        return merge(prodConfig, devConfig);
    }
    return prodConfig;
};
