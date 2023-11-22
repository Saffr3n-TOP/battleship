const path = require('path');
const TsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = ({ isDev }) => {
  return {
    mode: isDev ? 'development' : 'production',
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
      filename: `[name]${isDev ? '' : '.[contenthash]'}.js`,
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
    resolve: {
      extensions: ['.js', '.ts']
    },
    plugins: [
      new TsCheckerPlugin({
        typescript: {
          diagnosticOptions: { semantic: true, syntactic: true }
        }
      }),
      new HtmlPlugin({
        template: path.resolve(__dirname, 'assets', 'template.html')
      }),
      !isDev &&
        new CssExtractPlugin({
          filename: '[name].[contenthash].css'
        })
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.[jt]s$/i,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.s?css$/i,
          use: [
            isDev ? 'style-loader' : CssExtractPlugin.loader,
            'css-loader',
            !isDev && 'postcss-loader',
            'sass-loader'
          ].filter(Boolean)
        }
      ]
    },
    optimization: {
      minimizer: ['...', new CssMinimizerPlugin()]
    },
    devServer: {
      static: path.resolve(__dirname, 'dist')
    },
    devtool: !!isDev && 'eval-cheap-source-map'
  };
};
