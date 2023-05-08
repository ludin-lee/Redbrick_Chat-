import express from "express";
import * as dotenv from "dotenv"
dotenv.config()

const app = express();

app.use("/", express.static("statics"));

export default app;
