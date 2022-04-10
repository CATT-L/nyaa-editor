import { assign } from "lodash";

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
    __name: "io",
  },
  getters: {},
  mutations: {},
  actions: {
    getNodeInfo({ dispatch, state }, { path, name }) {},

    createFile({ dispatch, state }, { path, name }) {
      this.$log(state, `apply to create file '${name}' at '${path}'`);

      // todo verify name is duplicated or not
      // reload children sort

      return { name: name, type: "file", isDir: false };
    },

    createDirectory({ dispatch, state }, { path, name }) {
      this.$log(state, `apply to create directory '${name}' at '${path}'`);

      // todo verify name is duplicated or not

      // todo reload children sort

      return {
        name: name,
        type: "dir",
        isDir: true,
        children: [],
      };
    },

    rename({ dispatch, state }, { path, name, newName }) {
      this.$log(state, `rename ${name} to ${newName} at ${path}`);
      i;
      // todo verify the name is duplicated or not

      return {
        name: newName,
      };
    },

    move({ dispatch, state }, { path, name, newPath }) {},

    remove({ dispatch, state }, { path, name }) {
      this.$log(state, `remove ${name} at ${path}`);

      return true;
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
