const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");

app.whenReady().then(async () => {
  // 服务器
  const server = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });

  await server.loadFile(path.join(__dirname, "server.html"));

  // 客户端
  const client = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // client.loadURL("http://localhost:8080");
  client.loadFile(path.join('./dist/index.html'));

  client.on("close", function (e) {
    e.preventDefault();
    client.hide();
  });

  const tray = new Tray(path.join(__dirname, "assets/logo.png"));

  tray.on("click", function () {
    client.show();
  });

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "退出",
        click: () => {
          app.exit();
        },
      },
    ])
  );
});
