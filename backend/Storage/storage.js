
const mongoose = require("mongoose");

require("dotenv").config();

exports.database = () =>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("DataBase is connected.")
    }).catch((err)=>{
          console.error(err.message)
        console.log("Problem in DB.")
        process.exit(1)
    })
    
}