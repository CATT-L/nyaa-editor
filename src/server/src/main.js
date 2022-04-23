import http from 'http';

// 创建HTTP服务
const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello,world!");
});
server.listen(8080);

console.log("Server started!");