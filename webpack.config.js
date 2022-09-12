const path = require('path');
const { EnvironmentPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');

const prodConfig = {
    mode: 'production',
    entry: {
        index: `${__dirname}/src/index.ts`,
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'Core',
        umdNamedDefine: true,
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
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: `${__dirname}/package.json`,
                    to: `${__dirname}/build/`,
                },
                {
                    from: `${__dirname}/LICENSE`,
                    to: `${__dirname}/build/`,
                },
            ],
        }),
    ],
    optimization: {
        minimize: false,
    },
};

const devConfig = {
    mode: 'development',
};

module.exports = (env) => {
    if (env.development) {
        return merge(prodConfig, devConfig);
    }
    return prodConfig;
};
