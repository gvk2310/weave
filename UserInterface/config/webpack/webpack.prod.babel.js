const { CleanWebpackPlugin } = require('clean-webpack-plugin');
import paths from './paths';
import webpack from 'webpack';

module.exports = {
    mode: 'production',
    output: {
        publicPath: `###REACT_APP_PLATFORM_URL###/devnetops/`,
        filename: `${paths.jsFolder}/[name].[fullhash].js`,
        path: paths.outputPath,
        chunkFilename: '[name].[contenthash].js'
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
            PLATFORM_URL: `###REACT_APP_PLATFORM_URL###/gqlapi`,
            MYWD_KEY: '###MYWD_KEY###',
            MYWD_IV: '###MYWD_IV###',
            service_user: '###service_user###',
            service_key: '###service_key###'
          }),
        new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns:[paths.outputPath]})
    ],
    devtool: 'source-map'
};
