import webpack from 'webpack';

import paths from './paths';

module.exports = {
    mode: 'development',
    output: {
        publicPath: "http://localhost:15006/devnetops",
        filename: '[name].js',
        path: paths.outputPath,
        chunkFilename: '[name].js'
    },
    performance: {
        hints: 'warning',
        maxAssetSize: 20000000,
        maxEntrypointSize: 8500000,
        assetFilter: assetFilename => {
            return (
                assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
            );
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    devServer: {
        contentBase: paths.outputPath,
        compress: true,
        hot: true,
        historyApiFallback: true,
        port: 15006
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            DEBUG: true,
            API_URL: 'http://localhost:15006',
            MYWD_KEY: '###MYWD_KEY###',
            MYWD_IV: '###MYWD_IV###',
          }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
