import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

import paths from './paths';
import rules from './rules';

module.exports = {
    entry: paths.entryPath,
    module: {
        rules
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['*', '.js', '.scss', '.css']
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new ModuleFederationPlugin({
            name: "parent",
            library: { type: "var", name: "parent" },
            filename: 'remoteEntry.js',
            remotes: {
                mywizardplatform: "mywizardplatform",
                devnetopsui: "devnetopsui"
              },
            shared: ["react", "react-dom", "react-apollo"]
          }),
        new HtmlWebpackPlugin({
            template: paths.templatePath,
            favicon: './src/images/favicon.ico',
            minify: {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                preserveLineBreaks: true,
                minifyURLs: true,
                removeComments: true,
                removeAttributeQuotes: true
            },
          
              
            mcUrl: `${process.env.REACT_APP_PLATFORM_URL}/devnetopsui/remoteEntry.js`,
            
        })
    ]
};