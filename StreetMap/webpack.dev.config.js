const env = process.env.NODE_ENV;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: __dirname + '/src/js/app.js',
    output: {
        path: __dirname + '/dist',
        filename: 'main_[hash].js'
    },
    devServer: {
        contentBase: './dist',
        //port: '8888',//默认为8080
        inline: true,//实时刷新
        open: true,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                },
                exclude: /node_modules/
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "postcss-loader"
                    }, {
                        loader: "sass-loader"
                    }]
                })
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: {
                    loader: 'url-loader'
                }
            }, {
                test: /\.html$/,
                use: {
                    loader: 'html-withimg-loader'
                }
            }, {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                use: {
                    loader: 'url-loader?limit=50000&name=[name].[md5:hash:hex:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        //
        new HtmlWebpackPlugin({
            template: __dirname + '/src/main.tmpl.html'
            // filename: 'index.html'
        }),
        //
        new ExtractTextPlugin('main_[hash].css'),
        // new webpack.ProvidePlugin({}),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};
