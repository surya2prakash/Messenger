
const User = require("../../Model/userModel");

const mongoose = require("mongoose");

const Group = require("../../Model/groupModel");


exports.getAllUsers = async(req,res)=>{
     try{
               const userId = req.user.id;
          
          const [currentUser,otherUsers] = await Promise.all([
              
            //current user ko lao
                 User.findById(userId).populate('joinedgroup'),
               //other users ko fetch kro except me 
                    User.find({})
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


exports.userByName = async(req,res)=>{
     try{

      const userName = req.params.userName;

      if(!userName || userName === ''){
          return res.status(400).json({
             success:false,
             message:"Enter the Profile Name."
          })
      };

      //user name mil gya hai to --->

      const searchFor = new RegExp(userName,'i');

      const [findUserProfile, findGroupProfile] = await Promise.all([
            User.find({fullName:searchFor}),
            Group.find({groupName:searchFor})
      ])

     
     
           if(findGroupProfile.length === 0 && findUserProfile.length === 0)
           {
            return res.status(404).json({
                success:false,
                message:"Profile Not Found."
             })
            }else{
                  return res.status(200).json({
                      success:true,
                      message:'Profile found.',
                      data:{
                        group:findGroupProfile,
                           user:findUserProfile
                      }

                  })
           }

     }catch(err){
      console.error(err);
          return res.status(500).json({
             success:false,
             message:err.message
          })
     }
}

exports.currentuseringroup = async (req,res) =>{
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
            const isJoined = await User.find({joinedgroup:groupId});
            

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


//GET USER FOR PROFILE -->

exports.getUser = async(req,res)=>{
        try{

            const userId = req.user.id;

            const findUser = await User.findById(userId).populate("joinedgroup");

         
          return res.status(200).json({
             success:true,
             message:"Profile_found",
             data:findUser
          })


        }catch(err){
          console.error(err);
          return res.status(500).json({
             success:false,
             message:"Problem while getting the single user."
          })
        }
}