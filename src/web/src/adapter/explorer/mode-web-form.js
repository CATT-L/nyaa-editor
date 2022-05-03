export default {
  async selectFile(params) {
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

          input.remove();

          resolve(file);
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

  async readFile({ file, opt = {} }) {
    return await new Promise((resolve) => {
      var reader = new FileReader();

      reader.onload = (e) => {
        var data = {
          isError: false,
          message: "success",
          content: e.target.result,
        };
        resolve(data);
      };

      reader.onerror = (e) => {
        var data = {
          isError: true,
          message: e.message,
          content: "",
        };
        resolve(data);
      };

      reader.readAsText(file.data);
    });
  },
};
