const express=require('express');
const router=express.Router();
const {userMiddleware}=require("../middleware/user");
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');

router.get("balance", userMiddleware, async(req,res)=>{
       const user_id=req.user_id;

       const account=Account.findOne({
         userId:user_id
       })

       res.status(200).json({
        balance:account.balance
       })

})

router.post("/transfer", userMiddleware, async(req,res)=>{
   
    const session = await mongoose.startSession();
    session.startTransaction();

    const { amount, to } = req.body;
    
    const account = await Account.findOne({
        userId:req.user_id,
    }).session(session);

  

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Insufficient balance"
        });
    }

    const toAccount=await Account.findOne({
        userId:to
    }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Invalid account"
        });
    }

    

    await Account.updateOne({
        userId:req.user_id,
    },
      {
        $inc : {
            balance:-amount
        }
      }
    ).session(session);  

    
    await Account.updateOne({
        userId:to,
    }, 
       {
        $inc :{
            balance:amount
        }
       } 
    ).session(session);



    //end it bro
    await session.commitTransaction();

    res.json({
        msg: "Transfer successful"
})
})


module.exports=router;