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
          
      },
      groupImg:{
          type:String,
          required:true
      }
},{timestamps:true});


module.exports = mongoose.model("Group", groupSchema);