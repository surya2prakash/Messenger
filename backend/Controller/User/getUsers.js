
const User = require("../../Model/userModel");


exports.getAllUsers = async(req,res)=>{
     try{
               const userId = req.user.id;
          
          const [currentUser,otherUsers] = await Promise.all([
              
            //current user ko lao
                 User.findById(userId).populate('joinedgroup'),
               //other users ko fetch kro except me 
                    User.find({_id:{$ne :userId}})
          ])     

        return res.status(200).json({
            success:true,
            message:"Done",
            currentUser:currentUser,
            otherUsers:otherUsers
        })
     }catch(err){
        console.error(err.message);
     }
};


exports.adduseringroup = async (req,res) =>{
         try{
           
          const groupId = req.query.groupId;

          
           
          if(!groupId)
          {
               return res.status(400).json({
                     success:false,
                     message:"group id not found"
               });
          };

          //db me call kro
            const isJoined = await User.find({joinedgroup:{$ne:groupId}});
            

            return res.status(200).json({
               success:true,
               message:"users successfully found.",
               users:isJoined
            })



         }catch(err)
         {
             return res.status(500).json({
                success:false,
                message:"Problem while addUsercall"
             })
         }
}