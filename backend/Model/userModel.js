const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
     fullName:{
        type:String,
        required:true,
        trim:true
     },
     email:{
        type:String,
        required:true,
        unique:true,
        trim:true
     },
     password:{
        type:String,
        required:true,
        trim:true,
        select:false
     },
     joinedgroup:[
        {
          type:mongoose.Schema.Types.ObjectId,
          ref:"Group"
        }
     ]
},{timestamps:true});

module.exports=mongoose.model("User",userSchema);