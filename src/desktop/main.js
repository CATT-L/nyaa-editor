const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");

app.whenReady().then(async () => {
  // 后端服务
  const backendServer = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });

  await backendServer.loadFile(path.join(__dirname, "server.html"));

  // // 前端服务
  // const frontendServer = new BrowserWindow({
  //   show: false,
  //   webPreferences: {},
  // });

  var frontendUrl = "http://localhost:24061";
  var backendUrl = "http://localhost:8080";

  // 客户端
  const client = new BrowserWindow({
    width: 800,
    height: 600,
  });

  client.loadURL(frontendUrl);

  client.on("close", function (e) {
    app.quit(-1);
  });
});
