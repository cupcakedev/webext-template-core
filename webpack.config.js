const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtReloader = require('webpack-ext-reloader');
const TerserPlugin = require('terser-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (env) => ({
    mode: env.mode ?? 'production',
    entry: {
        background: `${__dirname}/src/background/index.tsx`,
        content: `${__dirname}/src/content/index.tsx`,
        popup: `${__dirname}/src/popup/index.tsx`,
    },
    output: {
        publicPath: '',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                    },
                ],
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
                test: /\.ttf$/,
                use: ['file-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        plugins: [new TsconfigPathsPlugin({})],
    },
    plugins: [
        new EnvironmentPlugin(['isPopup']),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './manifest.json',
                    force: true,
                },
                {
                    from: './src/assets/icon.png',
                    force: true,
                },
                {
                    from: './src/popup/popup.html',
                    force: true,
                },
            ],
        }),
        new ExtReloader(),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
});
