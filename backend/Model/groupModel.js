const mongoose = require("mongoose");



const groupSchema = new mongoose.Schema({
      groupName:{
         type:String,
         required:true,
         trim:true
      },
      groupMembers:[
         {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"           
         }
      ],
      admin:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"
      },
      description:{
          type:String,
          
      }
},{timestamps:true});


module.exports = mongoose.model("Group", groupSchema);