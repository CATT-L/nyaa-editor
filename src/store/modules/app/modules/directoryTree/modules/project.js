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
    __name: "project",

    list: [],
    count: 0,
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

      if (!db.get("project").isArray().value()) {
        db.set("project", []).write();
      }

      return db.get("project");
    },

    async create({ dispatch, state }, { name }) {
      const db = await dispatch("getDb");

      if (db.find({ name: name }).value()) {
        throw new Error(`The project ${name} is already exists.`);
      }

      var data = {
        id: await dispatch("snowflake/generate", {}, { root: true }),
        name: name,
      };

      db.push(data).write();

      dispatch("load");
    },

    async delete({ dispatch, state }, { item }) {
      const db = await dispatch("getDb");

      item.children.forEach(async (r) => {
        await dispatch(
          "app/directoryTree/file/delete",
          { item: r },
          { root: true }
        );
      });

      db.remove({ name: item.name }).write();

      dispatch("load");
    },

    async load({ dispatch, state }, params) {
      this.$log(state, "load");

      const db = await dispatch("getDb");

      state.list = [];
      state.list = db.value();
      state.count = db.size().value();
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

      dispatch("load");
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
