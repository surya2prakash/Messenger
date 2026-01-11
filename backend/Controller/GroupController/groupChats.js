
const GroupChat = require("../../Model/groupChats");

const Group = require("../../Model/groupModel");

exports.getAllChats = async(req,res) =>{
      try{

        const groupId = req.query.id;
        
        if(!groupId)
        {
            return res.status(404).json({
                success:false,
                message:"Group Id not found"
            });
        };

        const isGroup =await Group.findById({_id:groupId}).populate({
            path:"groupMembers",
            model:"User"
        }).exec();

          if(!isGroup){
              return res.status(404).json({
                 success:false,
                 message:"Group Not Found."
              })
          }

        let getOldChats = await GroupChat.find({groupId}).populate({
            path:"groupId",
            model:"Group"
        }).populate({
             path:"senderId",
             model:"User"
        }).exec();

       

        //ager mil gya hai to ---->

        return res.status(200).json({
            success:true,
            message:"Chat fetch",
            oldChats:getOldChats,
            groupDetails:isGroup
        })

      }catch(err){
        console.error(err.message);

        return res.status(500).json({
            success:false,
            message:"Problem in getAllChats"
        })

      }
};

