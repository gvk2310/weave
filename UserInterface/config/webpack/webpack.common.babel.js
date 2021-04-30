const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("../../package.json").dependencies;
import paths from './paths';
import rules from './rules';

module.exports = {
    entry: paths.entryPath,
    target:"web",
    module: {
        rules
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['*', '.js', '.scss', '.css'],
        alias: { "crypto": false }
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "devnetops",
            filename: 'remoteEntry.js',
            exposes: {
                './App' : './src/containers/App',
            },
            shared: {
                react: {
                    requiredVersion: deps.react,
                    import: "react", // the "react" package will be used a provided and fallback module
                    shareKey: "react", // under this name the shared module will be placed in the share scope
                    shareScope: "default", // share scope with this name will be used
                    singleton: true, // only a single version of the shared module is allowed
                },
                "react-dom": {
                    requiredVersion: deps["react-dom"],
                    singleton: true, // only a single version of the shared module is allowed
                },
            }
        }),
        new HtmlWebpackPlugin({
            template: paths.templatePath,
            minify: {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                preserveLineBreaks: true,
                minifyURLs: true,
                removeComments: true,
                removeAttributeQuotes: true
            }
        })
    ]
	
};
