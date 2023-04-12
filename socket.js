const app = require('./app')
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);

const roomName = 'redbrick_room'

io.on('connection',(socket)=>{
    console.log('connet!')


    socket.on('enter_room',(data,done)=>{
        socket.join(roomName)
        done();
        socket.to(roomName).emit("welcome",data)
    })

    socket.on('new_message',(data,done)=>{
        done()
        socket.to(roomName).emit("new_message",data)
    })
    socket.on('bye',(data)=>{
        socket.to(roomName).emit('bye',data)
    })

    socket.on('disconnect',()=>{
        console.log('close')
    })
})

server.listen(3000,()=>{
    console.log('server open')
})
