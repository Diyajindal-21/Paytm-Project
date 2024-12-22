const express=require("express");
const authmiddleware = require("../middleware");
const { Account } = require("../db");
const { default: mongoose } = require("mongoose");
const router=express.Router();
router.get("/balance",authmiddleware,async(req,res)=>{
    const account=await Account.findOne({
        userId:req.userId
    });
    res.json({
        balance:account.balance
    })
});
router.post("/transfer",authmiddleware,async(req,res)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    const {amount,to}=req.body;
    //fetch the accounts within the transaction
    const account=await Account.findOne({userId:req.userId}).session(session);
    if(!account||account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
            msg:"Account not found/Insufficient balance"
        })
    }
    const toaccount=await Account.findOne({userId:to}).session(session);
    if(!toaccount){
        await session.abortTransaction();
        return res.status(400).json({
            msg:"Invalid account"
        })
    }
    //perform te tranfer
    await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session);
    await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session);
    //commit the transaction or save the transaction
    await session.commitTransaction();
    res.json({
        msg:"Transfer done!"
    })
})
module.exports=router;