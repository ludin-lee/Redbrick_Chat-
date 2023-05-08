import PubSub from "../../conn.js";
const roomName = process.env.ROOMNAME;

class SocketController {
  constructor(socket) {
    this.socket = socket;
  }
  subscriber = new PubSub(); // 구독자
  publisher = new PubSub(); // 발행자

  enterRoom = async (data, done) => {
    this.socket.join(roomName); //룸 조인

    // await redisCli.hSet(this.socket.id, "nickname", data); //객체 만들기
    // await redisCli.sAdd("online", this.socket.id); //온라인에 id 저장

    this.socket.to(roomName).emit("welcome", data);
    await this.subscriber.subscribe("room");
    await this.publisher.publish("room", data); //
    done();
  };

  newMessage = async (data, done) => {
    this.socket.to(roomName).emit("new_message", data);
    await this.publisher.publish("room", data);
    done();
  };

  changeNickname = async (data) => {
    // await redisCli.hDel(this.socket.id); //닉네임 삭제
    // await redisCli.hSet(this.socket.id, "nickname", data.nickname); //닉네임 재설정
    this.socket.to(roomName).emit("new_message", data.notice); //공지
    done();
  };

  disconnect = async () => {
    // const { nickname } = await redisCli.hGetAll(this.socket.id); //닉네임
    // await redisCli.sRem("online", this.socket.id); //온라인에서 삭제
    // await redisCli.hDel(this.socket.id, "nickname"); //객체 삭제
    // this.socket.to(roomName).emit("bye", nickname); //공지
    await this.subscriber.unsubscribe("room");
  };
}

export default SocketController;
