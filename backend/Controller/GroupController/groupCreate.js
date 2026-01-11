
const User = require("../../Model/userModel");

const Group = require("../../Model/groupModel");


exports.addMember = async(req,res) =>{

       try{

         const  userId = req.user.id;

         const otherUserId = req.query.id;

         const groupId = req.query.gId ;

         if(!otherUserId)
         {
             return res.status(400).json({
                success:false,
                message:"Id not found"
             });
         };



         //check kro kahin pahle se to nhi hai -->

         const isExist = await Group.findOne({_id:groupId,groupMembers:otherUserId});

         if(isExist)
         {
            return res.status(409).json({
                success:false,
                message:"User Already in Group"
            });
         };


         //add kr do 

         const addUser = await Group.findByIdAndUpdate(groupId,{$push:{groupMembers:otherUserId}},{new:true});

          await User.findByIdAndUpdate(otherUserId,{$push:{joinedgroup:addUser._id}});

          return res.status(200).json({
            success:true,
            message:"User Added",
            user:addUser
          })
       }catch(err){
           console.error(err.message);
           return res.status(500).json({
            success:false,
            message:"Problem while add into group"
           })
       }
};


exports.groupCreate = async(req,res) =>{
       try{

           const userId = req.user.id;

           const {description,groupName} = req.body;
         
           if(!groupName)
           {
             return res.status(400).json({
                success:false,
                message:"Enter the group Name"
             });
           };
           
           let splitName = groupName.split(" ");
        
      let firstName = splitName[0];
      let lastName = null;
      if( splitName[1]){
       lastName = splitName[1]; 
    }

      let imageUrl = `https://ui-avatars.com/api/?name=${firstName}+${lastName}`
           //group create kro  

           const newGroup  = await Group.create({
                admin:userId,
                description,
              groupName,
                groupMembers:[userId],
                groupImg:imageUrl
              
           });
            await User.findByIdAndUpdate(userId,{$push:{joinedgroup:newGroup._id}});
           return res.status(201).json({
            success:true,
            message:"Group Created",
            group:newGroup,
            
           })


       }catch(err){
          console.error(err.message);
           return res.status(500).json({
            success:false,
            message:"Problem while createing group"
           })
       }
};

// remove person from the group --->

exports.removeUser=async(req,res)=>{
    try{
        
      let {userId,groupId} = req.params;
     
      if(!userId || !groupId){
        return res.status(400).json({
           success:false,
           message:"Id not found"
        })
      }
        const reqId = req.user.id;
       if(userId.toString() === reqId.toString()){
          // same hi user hai khud ko remove karna chahta hai 
            // pull group from user
           const [fromUser ,  removefromGroup ]= await Promise.all([
                 User.findByIdAndUpdate({_id:userId},{$pull:{joinedgroup:groupId}},{new:true}),

               Group.findByIdAndUpdate({_id:groupId},{$pull:{groupMembers:userId}},{new:true})
           ])

           return res.status(200).json({
             success:true,
             message:"User Removed."
           })
       }else{
            const checkAdmin = await Group.findOne({admin:reqId});
            
            if(checkAdmin){
              const [fromUser ,  removefromGroup ]= await Promise.all([
                 User.findByIdAndUpdate({_id:userId},{$pull:{joinedgroup:groupId}},{new:true}),

               Group.findByIdAndUpdate({_id:groupId},{$pull:{groupMembers:userId}},{new:true})
           ])

           return res.status(200).json({
             success:true,
             message:"User Removed."
           })

            }else{
                return res.status(401).json({
                   success:false,
                   message:"Not Allowed"
                })
            }
       }

    }catch(err)
    {
       console.error(err);
       return res.status(500).json({
         success:false,
         message:"Problem while Removing the user from group"
       })
    }
}

// update group Name --->

exports.updatetheGroupName = async(req,res) =>{
      try{
          const {groupId,updateGroupName} = req.body;
                console.log(groupId,updateGroupName);
          const userId = req.user.id;


          if(!groupId){
             return res.status(400).json({
               success:false,
               message:"Group Id not found."
             })
          };

          const checkGroup = await Group.findByIdAndUpdate({_id:groupId},{groupName:updateGroupName});

          if(!checkGroup){
               return res.status(404).json({
                 success:false,
                 message:"Group Not found."
               })
          };

         return res.status(200).json({
           success:true,
           message:"Updated Group"
         })
      }catch(err){
         console.error(err);
         return res.status(500).json({
           success:false,
           message:"Problem While Updating Group Name"
         })
      }
}


