
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

           //group create kro  

           const newGroup  = await Group.create({
                admin:userId,
                description,
              groupName,
                groupMembers:[userId]
              
           });
            await User.findByIdAndUpdate(userId,{$push:{joinedgroup:newGroup._id}});
           return res.status(201).json({
            success:true,
            message:"Group Created",
            group:newGroup
           })


       }catch(err){
          console.error(err.message);
           return res.status(500).json({
            success:false,
            message:"Problem while createing group"
           })
       }
}