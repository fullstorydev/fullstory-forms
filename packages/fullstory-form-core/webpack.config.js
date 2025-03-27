"use strict";

const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var DashedNamePlugin = require("../../build-scripts/webpack-dashed-name");
var RemoveCoreFromName = require("./webpack-remove-core-from-name");
const mergeFiles = require("merge-files");
const packageJson = require("./package.json");

const today = new Date();
const year = today.getFullYear();

const banner = [
  "surveyjs - FullStory Forms Core is JavaScript library v" +
    packageJson.version,
  "Copyright (c) 2015-" + year + " Devsoft Baltic OÜ  - http://surveyjs.io/",
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

var buildPlatformJson = {
  name: packageJson.name,
  version: packageJson.version,
  description:
    "survey.js is a JavaScript Survey Library. It is a modern way to add a survey to your website. It uses JSON for survey metadata and results.",
  keywords: [
    "Survey",
    "JavaScript",
    "Bootstrap",
    "Library",
    "survey",
    "library",
  ],
  homepage: "https://surveyjs.io/",
  license: "MIT",
  files: ["**/*"],
  main: "survey-core.js",
  repository: {
    type: "git",
    url: "https://github.com/surveyjs/surveyjs.git",
  },
  typings: "./typings/entries/index.d.ts",
  typesVersions: {
    "<4.2": {
      "*": ["ts3.4/*"],
    },
  },
};

function getPercentageHandler(emitNonSourceFiles, buildPath) {
  return function handler(percentage, msg) {
    if (0 == percentage) {
      console.log("Build started... good luck!");
    } else if (1 == percentage && emitNonSourceFiles) {
      fs.createReadStream("./README.md").pipe(
        fs.createWriteStream(buildPath + "README.md")
      );
      fs.writeFileSync(
        buildPath + "package.json",
        JSON.stringify(buildPlatformJson, null, 2),
        "utf8"
      );
    }
  };
}

module.exports = function (options) {
  const emitDeclarations = !!options.emitDeclarations;
  const emitNonSourceFiles = !!options.emitNonSourceFiles;
  var buildPath = __dirname + "/build/";
  var isProductionBuild = options.buildType === "prod";
  const compilerOptions = emitDeclarations
    ? {}
    : {
        declaration: false,
        declarationDir: null,
      };
  var config = {
    mode: isProductionBuild ? "production" : "development",
    entry: {
      [packageJson.name]: path.resolve(__dirname, "./entries/index.ts"),
      defaultV2: path.resolve(
        __dirname,
        "./src/defaultV2-theme/defaultV2.scss"
      ),
      "defaultV2.fontless": path.resolve(
        __dirname,
        "./src/defaultV2-theme/defaultV2.fontless.scss"
      ),
    },
    resolve: {
      extensions: [".ts", ".js", ".tsx", ".scss"],
    },
    optimization: {
      minimize: isProductionBuild,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: "ts-loader",
          options: {
            configFile: options.tsConfigFile || "tsconfig.json",
            transpileOnly: isProductionBuild,
          },
        },
        {
          test: /\.s(c|a)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: "",
              },
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: options.buildType !== "prod",
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: options.buildType !== "prod",
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          loader: "svg-inline-loader",
        },
      ],
    },
    output: {
      path: buildPath,
      filename: "[name]" + (isProductionBuild ? ".min" : "") + ".js",
      library: {
        root: options.libraryName || "Survey",
        amd: "[dashedname]",
        commonjs: "[dashedname]",
      },
      libraryTarget: "umd",
      globalObject: "this",
      umdNamedDefine: true,
    },
    plugins: [
      new webpack.ProgressPlugin(
        getPercentageHandler(emitNonSourceFiles, buildPath)
      ),
      new DashedNamePlugin(),
      new webpack.DefinePlugin({
        "process.env.RELEASE_DATE": JSON.stringify(
          new Date().toISOString().slice(0, 10)
        ),
        "process.env.VERSION": JSON.stringify(packageJson.version),
      }),
      new RemoveCoreFromName(),
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin({
        filename: isProductionBuild ? "[name].min.css" : "[name].css",
      }),
      new webpack.BannerPlugin({
        banner: banner,
      }),
    ],
  };

  if (isProductionBuild) {
    config.plugins.push = config.plugins.concat([]);
  } else {
    config.devtool = "source-map";
    config.plugins = config.plugins.concat([
      new webpack.LoaderOptionsPlugin({ debug: true }),
    ]);
  }

  return config;
};
