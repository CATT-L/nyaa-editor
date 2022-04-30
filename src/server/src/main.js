let PORT = 3000;

import Http from "http";
import Koa from "koa";
import SocketIO from "socket.io";

const api = new Koa();
const server = Http.createServer(api.callback());
const io = SocketIO(server);

api.use(async (ctx, next) => {
  if (ctx.request.path === "/") {
    ctx.response.body = "index page";
  } else {
    await next();
  }
});

io.of("/").on("connection", (socket) => {
  console.log("A user connected.");

  socket.emit("echo", "Hello, world!");

  socket.on("disconnect", () => {
    console.log("A user disconnected.");
  });

  socket.on("echo", (msg) => {
    console.log("Echo from client:" + msg);
    socket.emit("echo", msg);
  });
});

server.listen(PORT);
console.log("Server start listening on port:" + PORT);

