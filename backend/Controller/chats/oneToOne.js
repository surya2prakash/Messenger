//create 

const Message = require("../../Model/message");
const User = require("../../Model/userModel");

exports.getprivateChat = async(req,res)=>{
      try{

           const senderId = req.query.id;
           
             
           const userId = req.user.id;
       
             if(!senderId)
             {
                return res.status(404).json({
                    success:false,
                    message:"sender Id not found"
                });
             };
           
           const secondUser = await User.findById({_id:senderId});

           if(!senderId){
             return res.status(404).json({
                success:false,
                message:"User Not Found."
             })
           }

          //user ne jo message send kiya hai vo bhi aur jo sender ne message send kiya hai vo bhi dono    
         const fetchChats = await Message.find({
            $or:[
                {senderId:senderId,reciverId:userId},
                {reciverId:senderId,senderId:userId}
            ]
         
         }).sort({timestamps:1}).populate({
             path:"senderId",
             model:"User"
         });//assening order me mile ga 1->10

         if(fetchChats.length === 0)
         {
            return res.status(200).json({
                success:true,
                message:"No chats available",
                secondUser:secondUser
            })
         };

         //ager chats mil gai to send kr do 

         return res.status(200).json({
            success:true,
            message:"Chat fetch Done",
            chats:fetchChats,
            secondUser:secondUser
         })

      }catch(err){
         console.error(err.message)
      }
}