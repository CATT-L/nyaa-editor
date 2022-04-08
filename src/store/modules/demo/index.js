const modules = {};

try {
  // ./foo/index.js
  var files = require.context(
    "./modules",
    true,
    /^\.\/[^\/]*?\/[^\/]*?index\.js$/
  );
  files.keys().forEach((key) => {
    modules[key.replace(/(\.\/|\/index\.js)/g, "")] = files(key).default;
  });
} catch (e) {}

try {
  // ./foo.js
  var files = require.context("./modules", false, /\.js$/);
  files.keys().forEach((key) => {
    modules[key.replace(/(\.\/|\.js)/g, "")] = files(key).default;
  });
} catch (e) {}

export default {
  namespace: true,
  modules,
};
