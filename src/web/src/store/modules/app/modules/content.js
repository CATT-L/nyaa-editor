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
    __name: "content",
  },
  getters: {},
  mutations: {},
  actions: {
    async getDb({ dispatch, state }) {
      const db = await dispatch(
        "d2admin/db/database",
        { user: true },
        { root: true }
      );

      if (!db.get("file-content").isArray().value()) {
        db.set("file-content", []).write();
      }

      return db.get("file-content");
    },

    async save({ dispatch, state }, { item, content }) {
      const db = await dispatch("getDb");

      var data = db.find({ fileId: item.id });

      if (data.value()) {
        data.assign({ content: content }).write();
      } else {
        data = {
          id: await dispatch("snowflake/generate"),
          fileId: item.id,
          content: content,
        };
        db.push(data).write();
      }

      return data;
    },

    async fetchContent({ dispatch, state }, { item }) {
      const db = await dispatch("getDb");

      var data = db.find({ fileId: item.id });

      if (data.value()) {
        return data.value().content;
      } else {
        return "";
      }
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
