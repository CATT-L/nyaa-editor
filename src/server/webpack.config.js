const path = require("path");

let externals = _externals();

module.exports = {
  entry: {
    main: "./src/main.js",
  },
  target: "node",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: ["", ".js"],
  },
  externals: externals,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["es2015", "stage-0"],
        },
        exclude: /node_modules/,
      },
    ],
  },
};

function _externals() {
  let manifest = require("./package.json");
  let dependencies = manifest.dependencies;
  let externals = {};
  for (let p in dependencies) {
    externals[p] = "commonjs " + p;
  }
  return externals;
}
