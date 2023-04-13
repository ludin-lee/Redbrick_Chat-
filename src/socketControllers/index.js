const roomName = process.env.ROOMNAME;

class SocketController {
  constructor(socket) {
    this.socket = socket;
  }
  enterRoom = (data, done) => {
    this.socket.join(roomName);
    done();
    this.socket.to(roomName).emit("welcome", data);
  };

  newMessage = (data, done) => {
    done();
    this.socket.to(roomName).emit("new_message", data);
  };

  bye = (data) => {
    this.socket.to(roomName).emit("bye", data);
  };
  disconnect = () => {};
}

export default SocketController;
