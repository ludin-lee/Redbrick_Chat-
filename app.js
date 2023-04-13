import { server } from "./socket.js";
import express from "express";
const app = express();

app.use("/", express.static("statics"));

export default app;
