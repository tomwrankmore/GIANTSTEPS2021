const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


// Webpack uses this to work with directories

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const environment = require('./configuration/environment');
const { env } = require('process');

// HtmlWebpackPlugin template copy
const templateFiles = fs.readdirSync(path.resolve(__dirname, environment.paths.source, 'templates'));
const htmlPluginEntries = templateFiles.map((template) => new HtmlWebpackPlugin({
    inject: 'body',
    hash: false,
    filename: template,
    publicPath: 'auto',
    template: path.resolve(environment.paths.source, 'templates', template),
    favicon: path.resolve(environment.paths.source, 'images', 'favicon.ico')
}))

// This is the main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = {
    // Default mode for Webpack is production.
    // Depending on mode Webpack will apply different things
    // on final bundle. For now we don't need production's JavaScript 
    // minifying and other thing so let's set mode to development
    mode: 'development',

    // Path to your entry point. From this file Webpack will begin his work
    entry: path.resolve(environment.paths.source, 'js', 'index.js'),


    // Path and filename of your result bundle.
    // Webpack will bundle all JavaScript into this file
    output: {
        filename: 'js/[name].[contenthash].js',
        path: environment.paths.output,
        // publicPath: '/'
        // this will add a hash for cache but htmlwebpackplugin is already doing this.
    },
    optimization: {
        moduleIds: 'deterministic', // won't re hash vendors.js if it doesn't need to be
        runtimeChunk: 'single', // separate main js file from runtime.js - whatever that is.
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    // extract third-party libraries, to a separate vendor chunk.
                },
            },
        },
    },
    module: {
        rules: [
            {
                // this loader will grab assets like images referenced in html
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                // Apply rule for .sass, .scss or .css files
                test: /\.(sa|sc|c)ss$/,

                // Set loaders to transform files.
                // Loaders are applying from right to left(!)
                // The first loader will be applied after others, bottom up!

                use: [
                    {
                        // After all CSS loaders we use plugin to do his work.
                        // It gets all transformed CSS and extracts it into separate
                        // single bundled file using this plugin.
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    {
                        // This loader resolves url() and @imports inside CSS
                        loader: 'css-loader',
                    },
                    {
                        // Then we apply postCSS fixes like autoprefixer and minifying in postcss.config.js
                        loader: 'postcss-loader',
                    },
                    {
                        // First we transform SASS to standard CSS
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass')
                        }
                    }
                    // Now when Webpack finds import 'file.scss'; in code, it knows what to do!
                    // We need plugins to create the bundled css file though.
                ]
            },
            {
                // Now we apply rule for images that are referenced in the CSS
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        // Using file-loader for these files
                        loader: 'file-loader',

                        //In options we can set different things like format and directory to save
                        options: {
                            name: 'images/[name].[hash:6].[ext]',
                            // publicPath: '../',
                        }
                    }
                ]
            },
            // update to use output path images folder
            // {
            //     test: /\.(png|svg|jpg|jpeg|gif)$/i,
            //     type: 'asset/resource',
            //   },
            {
                // Apply rule for fonts files
                test: /\.(woff|woff2|ttf|otf|eot)$/,
                use: [
                    {
                        // Using file-loader too
                        loader: "file-loader",
                        options: {
                            name: 'fonts/[name].[hash:6].[ext]',
                            // publicPath: '../',
                        }
                    }
                ]
            },
            {
                // Apply rule for video files
                test: /\.(mp4)$/,
                use: [
                    {
                        // Using file-loader too
                        loader: "file-loader",
                        options: {
                            outputPath: 'video'
                        }
                    }
                ]
            }
        ]
    },
    // Plugins purpose is to do anything else that loaders can't. If we need to extract all that transformed CSS into a separate "bundle" file we have to use a plugin
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css'
        }),
        new ImageMinimizerPlugin({
            test: /\.(jpe?g|png|svg)$/i,
            minimizerOptions: {
                // Lossless optimization with custom option
                // Feel free to experiment with options for better result for you
                plugins: [
                    ['gifsicle', { interlaced: true }],
                    ['jpegtran', { progressive: true }],
                    ['optipng', { optimizationLevel: 5 }],
                    [
                        'svgo',
                        {
                            plugins: [
                                {
                                    removeViewBox: false,
                                },
                            ],
                        },
                    ],
                ],
            },
        }),
        // html-loader is taking care of images and videos referenced in the html.
        // might need the copy plugin for vendor folder.
        new CopyPlugin({
            patterns: [
                // {
                //     from: path.resolve(environment.paths.source, 'images'), 
                //     to: path.resolve(environment.paths.output, 'images'),
                //     toType: 'dir',
                //     globOptions: {
                //         ignore: ['*DS_Store', 'Thumbs.db'],
                //     },
                // },
                {
                    from: path.resolve(environment.paths.source, 'vid'),
                    to: path.resolve(environment.paths.output, 'vid'),
                    toType: 'dir',
                },
            ],
        }),
        // new CopyPlugin({
        //     patterns: [
        //         {
        //             //copy vendor js without processing it.
        //             from: path.resolve(environment.paths.source, 'js', 'vendor'), 
        //             to: path.resolve(environment.paths.output,  'js', 'vendor'),
        //             toType: 'dir',
        //         },
        //     ]
        // }),
        new CleanWebpackPlugin(),
    ].concat(htmlPluginEntries)
};