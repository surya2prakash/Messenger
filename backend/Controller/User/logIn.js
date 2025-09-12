
const User = require("../../Model/userModel");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.logIn = async(req,res) => {
    try{
        const {email,password} = req.body;

        if(!email)
        {
            return res.status(400).json({
                success:false,
                message:"Enter Email"
            });
        };

        if(!password)
        {
            return res.status(400).json({
                success:false,
                message:"Enter Password"
            });
        };

        const isUser = await User.findOne({email:email}).select("password");

        if(!isUser)
        {
            return res.status(400).json({
                success:false,
                message:"User not have Account"
            })
        };
       const ishashed = await bcrypt.compare(password,isUser.password);
       if(!ishashed)
       {
          return res.status(400).json({
            success:false,
            message:"Wrong Password"
          })
       }

       const payload={
           id:isUser._id,
           email:isUser.email,
           name:isUser.fullName
       }
        
       const token =  jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'2h'});

       const options={
            httpOnly:true,
            secure:false,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path:'/'
       }

        return res.cookie("token",token,options).status(200).json({
            success:true,
            message:"User Login",
           
            user:isUser

        })
    }catch(err){
        console.error(err.message);

        return res.status(500).json({
            success:false,
            message:"Problem while login."
        })
    }
}