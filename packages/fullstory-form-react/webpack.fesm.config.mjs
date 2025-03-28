import webpackCommonConfigCreator from "./webpack.config.js";
export default function (options) {
  options.tsConfigFile = "tsconfig.fesm.json";
  const config = webpackCommonConfigCreator(options);
  config.optimization.minimize = false;
  config.experiments = {
    outputModule: true
  };
  config.output = {
    filename: "[name]" + ".js",
    path: (config.output.path += "/fesm"),
    library: {
      type: "modern-module"
    }
  };
  config.externalsType = "module";
  config.externals = {
    react: "react",
    "react-dom": "react-dom",
    "fullstory-form-core": "fullstory-form-core"
  };
  const surveyReactUI = config.entry["fullstory-form-react"];
  config.entry = {
    "fullstory-form-react": surveyReactUI
  };
  return config;
}
