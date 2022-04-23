import { assign } from "lodash";
import SnowfalkeId from "snowflake-id";

const snowflake = new SnowfalkeId({
  mid: 42,
  offset: (2022 - 1970) * 31536000 * 1000,
});

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
    __name: "snowflake",
  },
  getters: {},
  mutations: {},
  actions: {
    generate({ dispatch, state }) {
      return snowflake.generate().toString();
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
