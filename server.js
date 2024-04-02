const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require('cors');
const path = require("path");
const { SocketAddress } = require("net");
const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver, {
  cors: {
    origin: "https://example.com",
    methods: ["GET", "POST"]
  }
});

const gamedirectory = path.join(__dirname, "app");
app.use(cors());
app.use(express.static(gamedirectory));

httpserver.listen(3000);

function getRoom(s) {
  return Array.from(s.rooms)[1];
}
io.on('connection', function(socket){
    // console.log(socket);
  socket.on('joinRoom',(room,username) => {
    socket.join(room);
    io.to(room).emit('joinRoom',username);
    console.log('joined room');
  })
  socket.on('message',(msg) => {
    console.log(msg);
    io.to(getRoom(socket)).emit('message',msg);
  })
})

