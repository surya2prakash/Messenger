
const GroupChat = require("../../Model/groupChats");

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

        let getOldChats = await GroupChat.find({groupId:groupId});

        if(!getOldChats)
        {
             return res.status(404).json({
                success:false,
                message:"No Chat"
             })
        }

        //ager mil gya hai to ---->

        return res.status(200).json({
            success:true,
            message:"Chat fetch",
            oldChats:getOldChats
        })

      }catch(err){
        console.error(err.message);

        return res.status(500).json({
            success:false,
            message:"Problem in getAllChats"
        })

      }
}