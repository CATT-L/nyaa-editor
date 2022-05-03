export default {
  async selectFile(params) {
    try {
      var re = await window.showOpenFilePicker();
      re = re[0];
    } catch (e) {
      var re = null;
    }

    return re;
  },
};
