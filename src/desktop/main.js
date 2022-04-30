const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");
const IsDev = process.env.NODE_ENV.trim() == "development";

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
    width: IsDev ? 1920 : 1280,
    height: IsDev ? 1080 : 720,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });

  client.loadURL(frontendUrl);

  if (IsDev) {
    client.webContents.openDevTools();
  }

  client.on("close", function (e) {
    app.quit(-1);
  });
});
