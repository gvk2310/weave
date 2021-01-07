const { CleanWebpackPlugin } = require('clean-webpack-plugin');

import paths from './paths';
import webpack from 'webpack';


module.exports = {
    mode: 'production',
    output: {
        publicPath: `${process.env.REACT_APP_PLATFORM_URL}/mywizardplatform/`,
        filename: `${paths.jsFolder}/[name].[hash].js`,
        path: paths.outputPath,
        chunkFilename: '[name].[chunkhash].js'
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


    plugins: [
        new webpack.EnvironmentPlugin({
            DEBUG: false,
            PLATFORM_URL: `${process.env.REACT_APP_PLATFORM_URL}/gqlapi`
        }),
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [paths.outputPath] }),
    ],
    devtool: 'source-map'
};