const express = require("express");

const app = express();

const {Server} = require("socket.io");

const http = require("http");

const cors = require("cors");

const server = http.createServer(app);

const io = new Server(server,{
  cors:{
      origin:"*",
      methods:['POST','GET'],
      credentials:true
  }
});

io.on("connection",(socket)=>{
      
      console.log(`User is connected : ${socket.id}`);

      socket.on('send_direct_message',({joinId_second,inputMsg})=>{
            console.log(`send by : ${joinId_second} ,messsage: ${inputMsg}`);

            io.to(joinId_second).emit('receive_msg',{
                from:socket.id,
                message:inputMsg
            })
      })

      socket.on('disconnect',()=>{
          console.log(`User disconnected ${socket.id}`);
      })
});

require("dotenv").config();

const PORT = process.env.PORT || 2000

server.listen(PORT,()=>{
   console.log(`server is listen at http://localhost:${PORT}`);
});

app.get("/",(req,res)=>{
    res.send(`<h1>Welcome</h1>`)
})