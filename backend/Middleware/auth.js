 const jwt = require("jsonwebtoken");

 require("dotenv").config();

 const Group = require("../Model/groupModel");


exports.auth = async(req,res,next)=>{
      try{

            const token = req.cookies.token ;
          

            if(!token)
            {
                return res.status(400).json({
                    success:false,
                    message:"Token Not Found."
                })
            };

            const payload =   jwt.verify(token,process.env.JWT_SECRET);

         req.user = payload;

         next();

      }catch(err){
       console.error(err.message);

       return res.status(500).json({
            success:false,
            message:"Authorization failed"
       })
      }
}




exports.isAdmin = async(req,res,next) =>{
      try{

            const userId = req.user.id;


            const checkUser = await Group.findOne({admin:userId});

            if(!checkUser)
            {
                return res.status(400).json({
                    success:false,
                    message:"Only Admin can add"
                });
            };

            next();

      }catch(err){
         console.error(err.message);

         return res.status(500).json({
            success:false,
            message:"Problem while admin auth"
         })
      }
}