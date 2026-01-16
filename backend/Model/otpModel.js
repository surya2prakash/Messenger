

const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

require("dotenv").config();

const otpSchema = mongoose.Schema({
        userId:{
              type:mongoose.Schema.Types.ObjectId,
              ref:"User",
              required:true
        },
        email:{
             type:String,
             required:true
        },
        otp:{
             type:Number,
             required:true
        },
        otpExpireAt:{
              type:Date,
              default: Date.now,
             index: {expires:300}
        }
        
});

otpSchema.post("save",async(doc)=> {
    try{
         let transporter = nodemailer.createTransport({
             host:process.env.MAIL_HOST,
             auth:{
                   user:process.env.MAIL_USER,
                    pass:process.env.MAIL_PASS
             }
         });

         let info =await transporter.sendMail({
                  from:"ChatBox",
                   to:doc.email,
                 subject:"Rest Password",
                  html:`<b>Your Otp</b><br><h2>${doc.otp}</h2>`
         })
    }catch(err){
       console.error(err);
    }  
})

module.exports = mongoose.model("Otp",otpSchema);

