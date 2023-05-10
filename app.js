const express = require("express");
const app = express();
const http = require("http")
const fs = require('fs')
const path = require("path")
const server = http.createServer(
   //{
   //   key:fs.readFileSync(path.join(__dirname,"cert",'key.pem')),
//   cert:fs.readFileSync(path.join(__dirname,"cert",'cert.pem')),
// },
app)

const { v4: uuidv4 } = require("uuid");     
app.set("view engine", "ejs");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
    console.log("join")
    socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId)
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  }); 
});
server.listen(4040, ()=>{
  console.log("Server running on port 4040");
})
//app.listen(4040,"192.168.29.196");