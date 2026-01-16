const express = require("express");

const router = express.Router();

const {signUp} = require("../Controller/User/signUp");
const {logIn} = require("../Controller/User/logIn")
const {auth,isAdmin,forgetPassAuth} = require("../Middleware/auth");
const {getAllUsers,adduseringroup,userByName,currentuseringroup,getUser} = require("../Controller/User/getUsers");
const {getprivateChat} = require("../Controller/chats/oneToOne");
const  {addMember,groupCreate,removeUser,updatetheGroupName} = require("../Controller/GroupController/groupCreate")
const {getAllChats}= require("../Controller/GroupController/groupChats");
const {deleteUserAccount,deleteGroup} = require("../Controller/User/deleteAccount");

const {forgetPassword,verifyOtp,setNewPassword}= require("../Controller/User/forgetPassword");
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
router.get("/profile",auth,getUser);
router.post("/group",auth,groupCreate);
router.get('/addUsers',auth,adduseringroup);
router.post("/addMember",auth,isAdmin,addMember);
router.get("/groupChat",auth,getAllChats);
router.get("/searchProfile/:userName",auth,userByName);
router.get("/currentuser",auth,currentuseringroup);
router.delete("/leave/:groupId/:userId",auth,removeUser);
router.patch("/updategroup",auth,isAdmin,updatetheGroupName)
router.delete("/deleteAccount",auth,deleteUserAccount);
router.delete("/delete/:gpId",auth,deleteGroup);
router.post("/logout",(req,res)=>{
         res.clearCookie('token');
         res.status(200).json({
             success:true,
             message:"Log-Out"
         })
});

router.post("/otp",forgetPassAuth,verifyOtp);
router.post("/forgetpassword",forgetPassword);
router.post("/setPassword",forgetPassAuth,setNewPassword);
module.exports = router;