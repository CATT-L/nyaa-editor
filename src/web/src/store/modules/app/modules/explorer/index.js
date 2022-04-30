import { assign } from "lodash";
import { saveAs } from "file-saver";

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
    async selectFile({ dispatch, state }, {}) {
      return await new Promise((resolve) => {
        var input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute(
          "style",
          "position: fixed; left: -100px; top: -100px;"
        );
        document.body.appendChild(input);

        var file = null;
        var verfiyTimer = null;
        var triggerVerify = () => {
          if (verfiyTimer) return;

          verfiyTimer = setTimeout(() => {
            verfiyTimer = null;

            if (file) {
              var data = {
                type: "input-file",
                raw: file,
              };

              this.$log(state, "选择文件: " + file.name, data);
            } else {
              var data = null;

              this.$log(state, "选择文件取消");
            }

            input.remove();

            resolve(data);
          }, 500);
        };

        input.focus();

        input.onclick = (e) => {
          setTimeout(() => {
            // input.onblur = (e) => {
            //   setTimeout(triggerVerify, 100);
            // };

            input.onfocus = (e) => {
              setTimeout(triggerVerify, 100);
            };
          }, 300);

          input.onchange = (e) => {
            input.onblur = null;
            input.onfocus = null;

            file = e.target.files[0];

            triggerVerify();
          };
        };

        input.click();
      });
    },

    /** 读取文件 */
    async readFile({ dispatch, state }, { file, opt = {} }) {
      return await new Promise((resolve, reject) => {
        var reader = new FileReader();

        reader.onload = (e) => {
          var data = {
            content: e.target.result,
          };

          resolve(data);
        };

        reader.readAsText(file.raw);
      });
    },

    async saveFile({ dispatch, state }, { file, content }) {

      var blob = new Blob([content]);

      saveAs(blob, file.raw.name);
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
