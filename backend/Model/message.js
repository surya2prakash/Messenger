//one to one chat save krne ke liye 

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
      senderId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User",
         required:true
      },
      reciverId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User",
         required:true
      },
      textMessage:{
          type:String,
          required:true,
          trim:true
      }

},{timestamps:true});

module.exports = mongoose.model("Message",messageSchema);