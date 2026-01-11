const User = require("../../Model/userModel");
const Group = require("../../Model/groupModel");
const GroupChat = require("../../Model/groupChats")
const Message = require("../../Model/message");
const { default: mongoose } = require("mongoose");


// user delete their account --->
exports.deleteUserAccount = async(req,res) =>{
          try{

            let userId = req.user.id;

               const user = await User.findById(userId);
           
            const groupList = await Group.find({groupMembers:userId});
            
              const onetooneChat = await Message.deleteMany({senderId:userId});
              if(!onetooneChat.acknowledged){
                  return res.status(400).json({
                     success:false,
                     message:"Problem while deleting single chat"
                  })
              };
            
            for(let group of groupList){  
              const groupMessage = await GroupChat.deleteMany({groupId:group._id,senderId:userId});

                
               }
            

            // delete form the group 
             for(let group of groupList){  
                 if(userId.toString() === group.admin.toString()){
                       const updatedGroup =  await Group.findByIdAndUpdate(group._id,{$pull:{groupMembers:userId}},{new:true});
                       if(updatedGroup.groupMembers.length > 0){
                         await Group.findByIdAndUpdate(group._id,{admin:updatedGroup.groupMembers[0]},{new:true})
                       }
                      if(updatedGroup.groupMembers.length === 0){
                           await Group.findByIdAndDelete(group._id);
                      }  

                }else{
                     const groupLength =  await Group.findByIdAndUpdate(group._id,{$pull:{groupMembers:userId}},{new:true});
                      if(groupLength.groupMembers.length === 0){
                           await Group.findByIdAndDelete(group._id);
                      }  
                 }
                  
             }
            const removeUser = await User.findByIdAndDelete(userId);

           

            return res.status(200).json({
                 success:true,
                 message:"Account Deleted Successfully."
            })

          }catch(err){
             console.error(err);

             return res.status(500).json({
                 success:false,
                 message:"Problem while deleting the Account"
             })
          }
};

// group delete

exports.deleteGroup = async(req,res) =>{
     //  const session = await mongoose.startSession();
     //        session.startTransaction();
        try{
         
             const {gpId} = req.params ;
               
             const userId = req.user.id ;
            
             if(!gpId){
               // await session.abortTransaction();
                 return res.status(400).json({
                     success:false,
                     message:"Group Id is missing"
                 });
             };

          //    find the group --->

           const group = await Group.findOne({_id:gpId,admin:userId});
             if(!group){
               // await session.abortTransaction();
                 return res.status(404).json({
                     success:false,
                     message:"Group Not Found."
                 })
             }
          if(group.groupMembers.length > 0){

               for(let id of group.groupMembers){
               
                       
                     await User.findOneAndUpdate({_id:id},{$pull:{joinedgroup:gpId}},{new:true})
             }
          } ; 
             
     
          const res_one=       await  Group.findByIdAndDelete(gpId)
           const resp_two =   await  GroupChat.deleteMany({groupId:gpId})

           if( !res_one || !resp_two){
                  return res.status(401).json({
                    success:false,
                     message:"Group Or Chat Problem While Deleting."
                  })
           }
     
               //  await session.commitTransaction();
               //     session.endSession();
          
          return res.status(200).json({
                success:true,
                message:"Group Delete."
          })
        }catch(err){
          console.error(err);
         
          //    await session.abortTransaction();
          //     session.endSession();
          return res.status(500).json({
                success:false,
                message:"Problem while deleting the group"
          })
        }
}