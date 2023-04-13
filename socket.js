import fs from "fs";
import app from "./app.js";
import http from "http";
import https from "https";
import { Server } from "socket.io";

/*Server Secure Setting*/
let server = "";
if (process.env.NODE_ENV == "prod" && process.env.HTTPSPORT) {
  try {
    const privateKey = fs.readFileSync(
      "/etc/letsencrypt/live/mylee.site/privkey.pem",
      "utf8"
    );
    const certificate = fs.readFileSync(
      "/etc/letsencrypt/live/mylee.site/cert.pem",
      "utf8"
    );
    const ca = fs.readFileSync(
      "/etc/letsencrypt/live/mylee.site/chain.pem",
      "utf8"
    );

    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca,
    };

    server = https.createServer(credentials, app);
  } catch (err) {
    console.log("HTTPS 서버가 실행되지 않습니다.");
    console.log(err);
  }
} else {
  server = http.createServer(app);
}

const io = new Server(server);

// const mylee = io.of("/mylee"); //nameSpace Test용

import SocketController from "./src/socketControllers/index.js";

io.on("connection", (socket) => {
  const socketController = new SocketController(socket);
  socket.on("enter_room", socketController.enterRoom);

  socket.on("new_message", socketController.newMessage);

  socket.on("bye", socketController.bye);

  socket.on("disconnect", socketController.disconnect);
});
export { server };
