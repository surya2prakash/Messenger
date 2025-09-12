
const User = require("../../Model/userModel");


exports.getAllUsers = async(req,res)=>{
     try{
            
        const allUser = await User.find().populate("joinedgroup").exec();

        if(!allUser)
        {
            return res.status(400).json({
                success:false,
                message:"Unable to fetch All Users"
            });
        };
      console.log(allUser);

        return res.status(200).json({
            success:true,
            message:"Done",
            users:allUser
        })
     }catch(err){
        console.error(err.message);
     }
}