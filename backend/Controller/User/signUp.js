
const User = require("../../Model/userModel");

const bcrypt = require("bcrypt");

exports.signUp = async(req,res)=>{
      try{

        const {fullName,email,password} = req.body;

        if(!fullName)
        {
            return res.status(400).json({
                success:false,
                message:"Enter Name"
            });
        };

        if(!email)
        {
            return res.status(400).json({
                success:false,
                message:"Enter Email"
            })
        };

        if(!password)
        {
            return res.status(400).json({
                success:false,
                message:"Enter Password"
            })
        };

        //check kro pahle se account to nhi hai ---->

        const isUser = await User.findOne({email:email});

        if(isUser)
        {
            return res.status(400).json({
                success:false,
                message:"User aleady Exist."
            })
        };
     const hashPassword = await bcrypt.hash(password,10);
       
      let splitName = fullName.split(" ");
        console.log(splitName);
      let firstName = splitName[0];
      let lastName = null;
      if( splitName[1]){
       lastName = splitName[1]; 
    }else{
        lastName=splitName[0][1];  
    }

      let imageUrl = `https://ui-avatars.com/api/?name=${firstName}+${lastName}`

        let newUser = new User({
            fullName,
            email,
            password:hashPassword,
            profileUrl:imageUrl
        });



        await newUser.save();

        return res.status(201).json({
            success:true,
            message:"User Created",
            user:newUser
        })

      }catch(err){
       console.error(err.message);

       return res.status(500).json({
           success:false,
           message:"Problem while Sign Up"
       })
      }
}