import fs from "fs";
import app from "./app.js";
import http from "http";
import https from "https";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import redisCache from "./conn.js";
import SocketController from "./src/controllers/socketControllers/index.js";
import RabbitmqWrapper from "./src/controllers/socketControllers/mq/rabbitmq.js";
// import SSE from "sse";

/*Server Secure Setting*/
let server = "";
if (process.env.NODE_ENV == "prod" && process.env.HTTPSPORT) {
  try {
    const privateKey = fs.readFileSync(process.env.PRIVATE_KEY, "utf8");
    const certificate = fs.readFileSync(process.env.CERTIFICATE, "utf8");
    const ca = fs.readFileSync(process.env.CA, "utf8");

    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca,
    };

    server = https.createServer(credentials, app);
  } catch (err) {
    console.log("HTTPS 서버가 실행되지 않습니다.");
    console.error(err);
  }
} else {
  server = http.createServer(app);
}

const io = new Server(server);
const adapter = createAdapter(redisCache, redisCache.duplicate());
io.adapter(adapter);

const mylee = io.of("/redbrick-game"); //nameSpace Test용

mylee.on("connection", (socket) => {
  const socketController = new SocketController(socket);

  socket.on("enter_room", socketController.enterRoom);
  socket.on("new_message", socketController.newMessage);
  socket.on("disconnect", socketController.disconnect);
  socket.on("change_nickname", socketController.changeNickname);
});

const test = new RabbitmqWrapper(process.env.LOCAL_HOST, "newMessage");
test.subscribeToQueue(mylee);

export default server;
