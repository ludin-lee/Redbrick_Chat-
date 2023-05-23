import express from "express";
import RabbitMqApi from "../controllers/socketControllers/mq/rabbitmq-api.js";
const router = express.Router();
const rabbitmqApi = new RabbitMqApi();

router.post("/send_msg", rabbitmqApi.send_message);
router.get("/get_msg", rabbitmqApi.recv_message);

export default router;
