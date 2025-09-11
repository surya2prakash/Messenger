//create 

const Message = require("../../Model/message");

exports.getprivateChat = async(req,res)=>{
      try{

           const senderId = req.query.id;

           const userId = req.user.id;
           console.log(senderId);
             if(!senderId)
             {
                return res.status(404).json({
                    success:false,
                    message:"sender Id not found"
                });
             };

          //user ne jo message send kiya hai vo bhi aur jo sender ne message send kiya hai vo bhi dono    
         const fetchChats = await Message.find({
            $or:[
                {senderId:senderId,reciverId:userId},
                {reciverId:senderId,senderId:userId}
            ]
         
         }).sort({timestamps:1});//assening order me mile ga 1->10

         if(fetchChats.length === 0)
         {
            return res.status(400).json({
                success:false,
                message:"No chats available"
            })
         };

         //ager chats mil gai to send kr do 

         return res.status(200).json({
            success:true,
            message:"Chat fetch Done",
            chats:fetchChats
         })

      }catch(err){
         console.error(err.message)
      }
}