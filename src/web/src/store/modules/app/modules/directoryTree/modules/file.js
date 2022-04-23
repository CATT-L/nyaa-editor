import { assign, sortBy } from "lodash";
import project from "./project";

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
    __name: "file",

    list: [],
  },
  getters: {
    children(state, getters) {
      return (parent) => {
        var list = [];

        if (parent.type === "project") {
          list = state.list;
          list = list.filter((r) => r.projectId === parent.id);
          list = list.filter((r) => r.parentId === null);
        } else {
          if (parent.isDir) {
            list = state.list;
            list = list.filter((r) => r.projectId === parent.projectId);
            list = list.filter((r) => r.parentId === parent.id);
          }
        }

        list.map((item) => {
          if (item.isDir) {
            item.children = getters.children(item);
          }
        });

        list = sortBy(list, (o) => !o.isDir, "name");

        return list;
      };
    },
  },
  mutations: {},
  actions: {
    async rename({ dispatch, state }, { item, name }) {
      const db = await dispatch("getDb");

      var projectId = item.projectId;
      var parentId = item.parentId;

      var isExist =
        db
          .filter({
            projectId: projectId,
            parentId: parentId,
          })
          .filter((r) => r.name.toLowerCase() === name.toLowerCase())
          .filter((r) => r.id !== item.id)
          .size()
          .value() > 0;

      if (isExist) {
        throw new Error(
          `The file ${name} is already exists in ${parent.name}.`
        );
      }

      db.find({ id: item.id }).assign({ name: name }).write();

      dispatch("load");
    },

    async delete({ dispatch, state }, { item }) {
      this.$log(state, `delete item ${item.name}`, item);

      const db = await dispatch("getDb");

      if (item.isDir) {
        item.children.forEach(async (r) => {
          await dispatch("delete", { item: r });
        });

        db.remove({ id: item.id }).write();
      } else {
        db.remove({ id: item.id }).write();
      }

      dispatch("load");
    },

    async create({ dispatch, state }, { parent, name, isDir }) {
      const db = await dispatch("getDb");

      if (parent.type === "project") {
        var projectId = parent.id;
        var parentId = null;
      } else {
        if (!parent.isDir) {
          throw new Error("You can only create file in directory.");
        }

        var projectId = parent.projectId;
        var parentId = parent.id;
      }

      var isExist =
        db
          .filter({
            projectId: projectId,
            parentId: parentId,
          })
          .filter((r) => r.name.toLowerCase() === name.toLowerCase())
          .size()
          .value() > 0;

      if (isExist) {
        throw new Error(
          `The file ${name} is already exists in ${parent.name}.`
        );
      }

      var data = {
        id: await dispatch("snowflake/generate", {}, { root: true }),
        projectId: projectId,
        parentId: parentId,
        name: name,
        type: isDir ? "dir" : "file",
        isDir: isDir,
      };

      db.push(data).write();
      db.sortBy("name");

      dispatch("load");
    },

    async load({ dispatch, state }) {
      this.$log(state, "load");

      const db = await dispatch("getDb");

      state.list = [];
      state.list = db.value();
      state.count = db.size().value();
    },

    async getDb({ dispatch, state }) {
      const db = await dispatch(
        "d2admin/db/database",
        { user: true },
        { root: true }
      );

      if (!db.get("file").isArray().value()) {
        db.set("file", []).write();
      }

      return db.get("file");
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
