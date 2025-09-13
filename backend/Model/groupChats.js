const mongoose = require("mongoose");

const groupChat = new mongoose.Schema({
      groupId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Group"
      },
      senderId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"
      },
      message:{
         type:String,
          required:true,
          trim:true
      }
},{timestamps:true});

module.exports = mongoose.model("GroupChat",groupChat);

