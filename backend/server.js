const express = require("express");

const app = express();

const cors = require("cors");

const http = require("http");
const cookie = require("cookie");

const jwt = require("jsonwebtoken");

const cookieparser = require("cookie-parser");
const {Server} = require("socket.io");

const Message = require("./Model/message");
const GroupChat = require("./Model/groupChats");
const Group = require("./Model/groupModel");
//middleware
require("dotenv").config();
app.use(express.json());
app.use(cookieparser());
const server = http.createServer(app);

app.use(cors({
     origin:"http://localhost:5500",
     methods:["POST","GET"],
     credentials:true
}));

 const io  = new Server(server,{
     cors:{
          origin:"http://localhost:5500",
          methods:["POST","GET"],
          credentials:true
     }
 })
const router = require("./Route/router");

app.use("/api/v1",router);

const db = require("./Storage/storage");

 db.database();


 io.use((socket,next)=>{
      try{

          const cookietoken = socket.handshake.headers.cookie

          if(!cookietoken)
          {
               return  next (new Error("cookie nhi mili"));
          }

          //ager mil gai hai to

          //cookies ko string me convert kro --->

          const cookies = cookie.parse(cookietoken);

        const token = cookies.token;

        //verify kro 

      const payload =   jwt.verify(token,process.env.JWT_SECRET);

       
         socket.user = payload;
       

        next();

      }catch(err){
          console.error(err.message);

          next(new Error("Auth failed. in socket"))
      }
 })

io.on("connection",async(socket)=>{
     
         socket.emit('userDetails',socket.user);
         
        socket.join(socket.user.id);

        //group ke liye room bnana
        //find kro ki user kaun kaun se group me hai  --->
       
        const userInGroups = await Group.find({groupMembers:socket.user.id});

        //jis jis group me user hoga uski id se mene room bna liya 
         userInGroups.forEach(group =>{
             socket.join(group._id.toString());
         });

     socket.on("new_message",async(data)=>{


          try{
           const {secondUser,textMessage} = data;

           //ager textMsg  nhi aaya hai to --->

           console.log("2nd user->",secondUser,"message ->",textMessage);

           if(!textMessage)
           {
                return ;
           };
            console.log(textMessage);
           //aya hai to db me save kro pahle

           const newMessage = await Message.create({
                senderId:socket.user.id ,
                reciverId:secondUser,
                textMessage
           });
           io.to(secondUser).emit("privateMsg",{
                 id:newMessage?._id,
                senderId:newMessage?.senderId,
                secondUser:newMessage?.reciverId,
                textMessage:newMessage?.textMessage
           })
          }catch(err){
               console.error(err.message);
          }
     })

     socket.on("group_new_message",async(data)=>{

          try{
            const {groupId,message} = data;
            const senderId = socket.user.id;

            if(!groupId && !message)
            {
               //waps jao
               return ;
            };

            //check kro user group ka member hai 

            const group = await Group.findOne({_id:groupId,groupMembers:senderId});

            if(!group)
            {
                return ;
            }

            //ager hai to pahle message ko save kro 

            let addChat = new GroupChat({
                 groupId:groupId,
                 senderId:senderId,
                 message:message
            });

            addChat.save();

            io.to(groupId).emit("recive_group_message",{
                  id:addChat._id,
                  senderId:addChat.senderId,
                  groupId:addChat.groupId,
                  message:addChat.message,
                  timeStamp:addChat.createdAt
            })

          }catch(err)
          {
             console.error(err.message);
          }
          
     })
      
     socket.on("disconnect",()=>{
          console.log(`user is disconnected`);
     })
})




const PORT = process.env.PORT || 2000

server.listen(PORT,()=>{
     console.log(`App is listen at http://localhost:${PORT}`);
});

app.get("/",(req,res)=>{
     res.send("Welcome");
})