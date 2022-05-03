export default {
  // 网页上传
  MODE_WEB_FORM: "WEB_FORM",

  // 网页IO
  MODE_WEB_IO: "WEB_IO",

  // Electron
  // MODE_ELECTRON: "ELECTRON",

  CACHE_MODE: null,

  async getMode() {
    if (!this.CACHE_MODE) {
      var mode = this.MODE_WEB_FORM;

      if (typeof window.showOpenFilePicker == "function") {
        // mode = this.MODE_WEB_IO;
      }

      this.CACHE_MODE = mode;
    }

    return this.CACHE_MODE;
  },

  async createAdapter(mode) {
    switch (mode) {
      case this.MODE_WEB_IO:
        return require("./mode-web-io").default;
      case this.MODE_WEB_FORM:
        return require("./mode-web-form").default;
      default:
    }

    throw new Error(`未找到 ${mode} 模式的 Explorer 适配器`);
  },

  async selectFile(params) {
    var mode = await this.getMode();
    var adapter = await this.createAdapter(mode);
    var data = await adapter.selectFile(params);

    return { mode, data };
  },

  async readFile({ file, opt = {} }) {
    var mode = file.mode;
    var adapter = await this.createAdapter(mode);
    var data = await adapter.readFile({ file, opt });

    return { mode, data };
  },

  async saveFile() {},
};
