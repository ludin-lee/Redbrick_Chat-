import Cache from "../../conn.js";
const roomName = process.env.ROOMNAME;

const cache = new Cache();
const redisCache = await cache.CacheBuilder();

class SocketController {
  constructor(socket) {
    this.socket = socket;
    this.redisCache = redisCache;
  }

  enterRoom = async (data, done) => {
    this.socket.join(roomName); //룸 조인

    // await this.redisCache.publish(
    //   "online",
    //   `{ "type":"login","nickname":"${data}" }`
    // );
    await this.redisCache.hSet(this.socket.id, "nickname", data); //객체 만들기
    await this.redisCache.sAdd("onlineNickname", data);
    await this.redisCache.sAdd("online", this.socket.id); //온라인에 id 저장
    const onlineUsers = await this.redisCache.sMembers("onlineNickname");
    this.socket.to(roomName).emit("online", onlineUsers);
    this.socket.to(roomName).emit("welcome", data);
    done(onlineUsers);
  };

  newMessage = async (data, done) => {
    this.socket.to(roomName).emit("new_message", data);
    done();
  };

  changeNickname = async (data, done) => {
    await this.redisCache.hDel(this.socket.id, "nickname"); //닉네임 삭제
    await this.redisCache.hSet(this.socket.id, "nickname", data.nickname); //닉네임 재설정
    await this.redisCache.sRem("onlineNickname", data.originalNickname);
    await this.redisCache.sAdd("onlineNickname", data.nickname);

    const onlineUsers = await this.redisCache.sMembers("onlineNickname");
    this.socket.to(roomName).emit("online", onlineUsers);
    this.socket.to(roomName).emit("new_message", data.notice); //공지
    done(onlineUsers);
  };

  disconnect = async () => {
    const { nickname } = await this.redisCache.hGetAll(this.socket.id); //닉네임
    await this.redisCache.sRem("online", this.socket.id); //온라인에서 삭제
    await this.redisCache.hDel(this.socket.id, "nickname"); //객체 삭제
    if (nickname !== undefined)
      await this.redisCache.sRem("onlineNickname", nickname);
    // await this.redisCache.publish(
    //   "online",
    //   `{ "type":"logout","nickname":"${nickname}" }`
    // );
    const onlineUsers = await this.redisCache.sMembers("onlineNickname");
    this.socket.to(roomName).emit("bye", nickname); //공지
    this.socket.to(roomName).emit("online", onlineUsers);
  };

  // online = async () => {
  // const subRedisCache = await cache.CacheBuilder();
  //   await subRedisCache.subscribe("online", (message) => {
  //     this.socket.to(roomName).emit("online", message);
  //   });
  // };
}

export default SocketController;
