export default {
  // 网页上传
  MODE_WEB_FORM: "WEB_FORM",

  // 网页IO
  MODE_WEB_IO: "WEB_IO",

  // Electron
  // MODE_ELECTRON: "ELECTRON",

  CACHE_MODE: null,

  CACHE_ADAPTER: null,

  async getMode() {
    if (!this.CACHE_MODE) {
      var mode = this.MODE_WEB_FORM;

      if (typeof window.showOpenFilePicker == "function") {
        mode = this.MODE_WEB_IO;
      }

      this.CACHE_MODE = mode;
    }

    return this.CACHE_MODE;
  },

  async createAdapter() {
    if (!this.CACHE_ADAPTER) {
      var currentMode = await this.getMode();

      switch (currentMode) {
        case this.MODE_WEB_IO:
          this.CACHE_ADAPTER = require("./mode-web-io").default;
          break;
        case this.MODE_WEB_FORM:
          this.CACHE_ADAPTER = require("./mode-web-form").default;
          break;
        default:
          throw new Error(`未找到 ${currentMode} 模式的 Explorer 适配器`);
      }
    }

    return this.CACHE_ADAPTER;
  },

  async selectFile(params) {
    var mode = await this.getMode();
    var adapter = await this.createAdapter();
    var data = await adapter.selectFile(params);

    return { mode, data };
  },

  async readFile() {},

  async saveFile() {},
};
