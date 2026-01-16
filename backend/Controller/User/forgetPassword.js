

const User = require("../../Model/userModel");
const Otp = require("../../Model/otpModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


exports.forgetPassword = async(req,res)=>{
      try{

        const {email} = req.body;
        console.log(email);

        if(!email){
            return Response.status(400).json({
                 success:false,
                 message:"Enter the email."
            });
        };

        const findEmail = await User.findOne({email:email});

        if(!findEmail){
              return res.status(404).json({
                 success:false,
                 message:"User Not Found."
              });
        };

        const checkDoc = await Otp.findOne({userId:findEmail._id});

          const otpset = Math.floor(1000+Math.random()*9000);

        if(!checkDoc){
            
          

             const newOtp = new Otp({
                  userId:findEmail._id,
                  email:findEmail.email,
                  otp:otpset
             });

             await newOtp.save();
        }else{
              checkDoc.otp = otpset;
              checkDoc.otpExpireAt = Date.now();
             await checkDoc.save();
        }

        const payload ={
              email:email
        };

        const secToken =  jwt.sign(payload,process.env.JWT_SECOND,{expiresIn:"4m"});

        

        return res.status(200).json({
             success:true,
             message:"Otp is Send to Your Email.",
             data:{
                forgetToken:secToken
             }
        })


      }catch(err){
        console.error(err);
          return res.status(500).json({
             success:false,
             message:err.message
          })
      }
}


exports.verifyOtp = async(req,res)=>{
     try{

        const {otp} = req.body;
        console.log(typeof otp);

        const userDetails = req.forgetPass ;
       const currOtp = Number(otp);


        if(otp===""){
             return res.status(404).json({
                 success:false,
                 message:"Otp is Missing."
             });
        };


        const checkOtp = await Otp.findOne({
           email:userDetails.email,
           
        });

        console.log(typeof checkOtp.otp);

        if(checkOtp.otp !== currOtp){
              return res.status(400).json({
                 success:false,
                 message:"Wrong,Otp Not Match."
              });
        };

       return res.status(200).json({
         success:true,
         message:"Otp verifyed."
       })


     }catch(err){
           console.error(err);

           return res.status(500).json({
             success:false,
             message:err.message
           })
     }
};


exports.setNewPassword = async(req,res) =>{
       try{

           const {password} = req.body;

           if(!password){
               return res.status(404).json({
                  success:false,
                  message:"Password is Missing."
               });
           };

           const userDetails = req.forgetPass;

         const hashPassword = await bcrypt.hash(password,10);

           const checkUser = await User.findOneAndUpdate({email:userDetails.email},{password:hashPassword},{new:true});

           if(!checkUser){
               return res.status(404).json({
                 success:false,
                 message:"User Not Found."
               });
           };

            return res.status(200).json({
                 success:true,
                 message:"Password Changed SuccessFully."
            })

       }catch(err){
          console.error(err);
          return res.status(500).json({
             success:false,
             message:"Problem while New Password"
          })
       }
}