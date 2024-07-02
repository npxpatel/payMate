const express= require("express");
const userRouter=require("./user");
const accountRouter=require("./account");
const {Router}=require('express');
const router=Router();


router.use("/user",userRouter);
router.use("/account",accountRouter);


module.exports=router;