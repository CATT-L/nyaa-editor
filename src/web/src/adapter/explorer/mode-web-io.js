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

  async readFile({ file, opt = {} }) {
    return await new Promise(async (resolve) => {
      var reader = new FileReader();

      reader.onload = (e) => {
        var data = {
          isSuccess: true,
          message: "success",
          content: e.target.result,
        };
        resolve(data);
      };

      reader.onerror = (e) => {
        var data = {
          isSuccess: false,
          message: e.message,
          content: "",
        };
        resolve(data);
      };

      reader.readAsText(await file.data.getFile());
    });
  },

  async saveFile({ file, content }) {
    var blob = new Blob([content]);
    var writable = await file.data.createWritable();

    writable.write(blob);

    writable.close();

    return { isSuccess: true };
  },
};
