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
     origin:"https://projectmessenger.netlify.app",
     methods:["POST","GET","DELETE",'PATCH'],
     credentials:true
}));

 const io  = new Server(server,{
      cors:{
           origin:"https://projectmessenger.netlify.app",
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

           const token = socket.handshake.auth.token;


                if(!token)
                {
                     return next(new Error("token missing"));
                };

        //verify kro 

      const payload =   jwt.verify(token,process.env.JWT_SECRET);

         
         socket.user = payload;
       

        next();

      }catch(err){
          console.error(err.message);

          next(new Error("Auth failed. in socket"))
      }
 })
 let onlineUserId = new Map();
io.on("connection",async(socket)=>{
         

     console.log("user is connected");
         socket.emit('userDetails',socket.user);
         
        socket.join(socket.user.id);
        
        
        socket.on("online",(userId)=>{

          
          if(userId && !onlineUserId.has(userId)){
              onlineUserId.set(userId,socket.id);
          }

          io.emit("getOnlineUsers",Array.from(onlineUserId.keys()));
     })
        //group ke liye room bnana
        //find kro ki user kaun kaun se group me hai  --->
       
        

        //jis jis group me user hoga uski id se mene room bna liya 
         

     socket.on("new_message",async(data)=>{
             
           
          try{
           const {senderId,textMessage} = data;

           //ager textMsg  nhi aaya hai to --->

        

           if(!textMessage)
           {
                return ;
           };
           
           //aya hai to db me save kro pahle

          

           const newMessage = await Message.create({
                senderId:socket.user.id ,
                reciverId:senderId,
                textMessage
           });
              
          
           io.to(senderId).emit("privateMsg",{
                 id:newMessage?._id,
                senderId:newMessage?.senderId,
                reciverId:newMessage?.reciverId,
                textMessage:newMessage?.textMessage,
                
              
           });
               
           if(socket.user.id !== newMessage?.reciverId.toString()){
               
               
               
                io.to(socket.user.id).emit("privateToMsg",{
                id:newMessage?._id,
                senderId:newMessage?.senderId,
                reciverId:newMessage?.reciverId,
                textMessage:newMessage?.textMessage,
                
           });
           }
          
          }catch(err){
               console.error(err);
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
             const name = socket.user.name;
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
                  timeStamp:addChat.createdAt,
                  senderName:name
            })
           console.log("message send ho gya");
          }catch(err)
          {
             console.error(err.message);
          }
          
     })
  
     socket.on("join_group",(groupId)=>{
             socket.join(groupId);
     }) 
      
     

     
      
     socket.on("disconnect",()=>{
          console.log(`user is disconnected`);

          let removeUserId ;

          for(const[userId,socketId] of onlineUserId.entries()){

               if(socket.id===socketId){
                     removeUserId = userId
                     break;
               }
            
          };
          if(removeUserId){
               onlineUserId.delete(removeUserId);
            }
            io.emit("getOnlineUsers",Array.from(onlineUserId.keys()));
            io.emit("offline",{});
          
     });

     if(socket.user){

          try{
          const userInGroups = await Group.find({groupMembers:socket.user.id});
    
             userInGroups.forEach(group =>{
             socket.join(group._id.toString());
         });
          }catch(err){
                console.error(err);
          }
            
     }

    
})




const PORT = process.env.PORT || 2000

server.listen(PORT,()=>{
     console.log(`App is listen at http://localhost:${PORT}`);
});

