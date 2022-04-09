const { defineConfig } = require("@vue/cli-service");

process.env.VUE_APP_NAME = require("./package.json").name;
process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
});
