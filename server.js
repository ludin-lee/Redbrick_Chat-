import { server } from "./socket.js";
import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV == "production" && process.env.HTTPSPORT) {
  const HTTPSPORT = process.env.HTTPSPORT;

  server.listen(HTTPSPORT, () => {
    console.log(HTTPSPORT, "포트로 https 서버가 열렸어요!");
  });
} else {
  const HTTPPORT = process.env.HTTPPORT;
  server.listen(HTTPPORT, () => {
    console.log(HTTPPORT, "포트로 http 서버가 열렸어요!");
  });
}
