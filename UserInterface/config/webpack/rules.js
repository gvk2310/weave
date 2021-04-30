module.exports = [
    {
        test: /bootstrap\.js$/,
        loader: "bundle-loader",
        options: {
            lazy: true,
        },
    },
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader'
        }
    },
    {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }
        ]
    },
    {
        test: /\.css$/,
        use: [
            {
                loader: 'style-loader',
            },
            {
                loader: 'css-loader',
            },
        ]
    },
    {
        test: /\.s(a|c)ss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
    },
    {
        test: /\.(png|jpg|gif)$/i,
        exclude: /node_modules/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 8192,
                },
            },
        ],
    },
    {
        test: /\.(woff|woff2)$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 8192,
                },
            },
        ],
    },
    {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/octet-stream'
                },
            },
        ],
    },
    {
        test: /\.svg$/,
        use: [
            {
                loader: 'svg-url-loader',
                options: {
                    limit: 10000,
                },
            },
        ],
    },
];
