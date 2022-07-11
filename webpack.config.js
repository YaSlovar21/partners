const path = require('path'); // подключаем path к конфигу вебпак
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

const {paths} = require('./sitemap');

//const faviconPath = 'src/images/favicon.svg';
const canonicalURL = 'https://www.utermo.ru'

//import {initialHeatEx} from './src/js/utils/constants.js';
//console.log(initialHeatEx);

module.exports = {
  entry: {
    index: "./src/ppages/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js",
    assetModuleFilename: "images/[hash][ext]",
    //publicPath: ''
  },
  // добавили режим разработчика
  mode: "development",
  devServer: {
    static: path.resolve(__dirname, "./dist"), // путь, куда "смотрит" режим разработчика
    compress: true, // это ускорит загрузку в режиме разработки
    port: 8081, // порт, чтобы открывать сайт по адресу localhost:8080, но можно поменять порт
    open: true, // сайт будет открываться сам при запуске npm run dev
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: "/node_modules/",
      },
      {
        test: /favicon\.svg/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "",
            },
          },
        ],
      },
      /*{ // грузим инлайново из файлика шаблона страницы блога
       test: /\.html$/,
       include: [
         path.resolve(__dirname, './src/articles/')
       ],
       loader: "html-loader"
      },*/
      {
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
        type: "asset/resource",
        exclude: [
          path.resolve(__dirname, "./src/images/favicon.svg"),
          path.resolve(__dirname, "./src/blog-images/"),
          path.resolve(__dirname, "./src/insets/schemes/svg-schemes/"),
        ],
      },
      {
          test: /\.svg$/,
          loader: 'svg-inline-loader',
          include: [path.resolve(__dirname, "./src/insets/schemes/svg-schemes/")],
          options: {
            name: 'itCanBeWhatever/[name].[ext]' // It does not have to follow same path or file name than files in 'src'
          },
      },
      {
        // загрузка документов в documents/
        test: /\.(doc|pdf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "documents",
            },
          },
        ],
      },
      {
        test: /robots\.txt/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
      {
        test: /\.css$/,
        // при обработке этих файлов нужно использовать
        // MiniCssExtractPlugin.loader и css-loader
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          // Добавьте postcss-loader
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateParameters: {
        canonicalURL,
      },
      title:
        "KUPCOV.PARTNERS | У кого мы рекомендуем заказывать интернет-магазин?",
      meta: {
        keywords: "",
        description: ``,
      },
      template: "./src/index.html", // путь к файлу index.html
      chunks: ["index"],
    }),
   
    /*
    new HtmlWebpackInlineSVGPlugin(),
    ---------LPBTP-----------*/

  

    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new SitemapPlugin({ base: canonicalURL, paths }),
  ],
};