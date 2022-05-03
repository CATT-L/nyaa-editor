import { assign } from "lodash";

import ExplorerAdapter from "@/adapter/explorer";

const modules = {};

// try {
//   // ./foo/index.js
//   var files = require.context(
//     "./modules",
//     true,
//     /^\.\/[^\/]*?\/[^\/]*?index\.js$/
//   );
//   files.keys().forEach((key) => {
//     modules[key.replace(/(\.\/|\/index\.js)/g, "")] = files(key).default;
//   });
// } catch (e) {}

// try {
//   // ./foo.js
//   var files = require.context("./modules", false, /\.js$/);
//   files.keys().forEach((key) => {
//     modules[key.replace(/(\.\/|\.js)/g, "")] = files(key).default;
//   });
// } catch (e) {}

const store = {
  state: {
    __prefix: "",
    __name: "explorer",
  },
  getters: {},
  mutations: {},
  actions: {
    /** 选取文件 */
    async selectFile({ dispatch, state }, params) {
      var data = await ExplorerAdapter.selectFile(params);

      this.$log(state, "选择文件", { data });

      return data;
    },

    /** 读取文件 */
    async readFile({ dispatch, state }, { file, opt = {} }) {
      this.$log(state, "读取文件", { file, opt });

      var data = await ExplorerAdapter.readFile({ file, opt });

      return data;
    },

    /** 保存文件 */
    async saveFile({ dispatch, state }, { file, content }) {
      this.$log(state, "保存文件", { file });

      var data = await ExplorerAdapter.saveFile({ file, content });

      return data;
    },

    __autoload({ dispatch, state }, prefix = "") {
      state.__prefix = prefix + "/";

      this.$log(state, "autoload");

      Object.keys(modules).forEach((key) => {
        if (
          !!modules[key]["actions"] &&
          !!modules[key]["actions"]["__autoload"]
        ) {
          dispatch(`${key}/__autoload`, state.__prefix + state.__name);
        }
      });
    },
  },
};

export default assign(
  {
    namespaced: true,
    modules,
  },
  store
);
