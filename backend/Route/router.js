const express = require("express");

const router = express.Router();

const {signUp} = require("../Controller/User/signUp");
const {logIn} = require("../Controller/User/logIn")
const {auth,isAdmin} = require("../Middleware/auth");
const {getAllUsers} = require("../Controller/User/getUsers");
const {getprivateChat} = require("../Controller/chats/oneToOne");
const  {addMember,groupCreate} = require("../Controller/GroupController/groupCreate")
const {getAllChats}= require("../Controller/GroupController/groupChats");

router.post("/login",logIn);
router.post("/sign",signUp);

router.get("/verifytoken",auth,(req,res)=>{
        return res.status(200).json({
            success:true,
            message:"token verifyed",
            user:req.user
        })
})
router.get("/getuser",auth,getAllUsers);
router.get("/message",auth,getprivateChat);

router.post("/group",auth,groupCreate);
router.post("/addMember",auth,isAdmin,addMember);
router.get("/groupChat",auth,getAllChats);
module.exports = router;