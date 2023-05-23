import express from "express";
import * as dotenv from "dotenv";
import router from "./src/routers/index.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/", express.urlencoded({ extended: false }));
app.use("/", router);
app.use("/chatting", express.static("statics"));

export default app;
