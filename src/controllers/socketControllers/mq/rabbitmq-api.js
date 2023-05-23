import Rabbitmq from "./rabbitmq.js";
const url = "amqp://127.0.0.1"; //rabbitmq url
const queue = "web_msg"; //임시 queue이름이고 필요한 상황에 맞게 이름 따로 지정해줘야 한다.

class RabbitMqApi {
  send_message = async (req, res) => {
    try {
      let { msg } = req.body;

      const conn = new Rabbitmq(url, queue);

      await conn.send_message(msg);
      res.status(200).json({ result: true });
    } catch (error) {
      console.log(error);
    }
  };

  recv_message = async (req, res) => {
    try {
      const conn = new Rabbitmq(url, queue);
      const msg = await conn.recv_message();
      res.status(200).json({ result: msg });
    } catch (error) {}
  };
}

export default RabbitMqApi;
