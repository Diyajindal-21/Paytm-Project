const express=require("express");
const router=express.Router();
const zod=require("zod");
const { User, Account } = require("../db");
const jwt=require("jsonwebtoken");
const {JWT_secret}=require("../config");
const authmiddleware = require("../middleware");


const signupBody=zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()
})
router.post("/signup",async (req,res)=>{
    const {success}=signupBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg:"Email already taken/Incorrect inputs"
        })
    }
    const existingUser=await User.findOne({
        username:req.body.username
    })
    if(existingUser){
        return res.status(411).json({
            msg:"Email already taken/Incorrect inputs"
        })
    }
    const user=await User.create({
        username:req.body.username,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName
    })
    const userId=user._id;
    await Account.create({
        userId,
        balance:1+Math.random()*10000
    })
    const token=jwt.sign({
        userId
    },JWT_secret);
    res.json({
        msg:"User created successfully",
        token:token
    })
})

const signinBody=zod.object({
    username:zod.string().email(),
    password:zod.string()
})
router.post("/signin",async (req,res)=>{
    const {success}=signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg:"Email already taken/Incorrect inputs"
        })
    }
    const user=await User.findOne({
        username:req.body.username,
        password:req.body.password
    })
    if(user){
        const token=jwt.sign({
            userId:user._id,
        },JWT_secret)
        res.json({
            token:token
        })
        return;
    }
    res.status(411).json({
        msg:"Error while logging in"
    })
})

const updateBody=zod.object({
    username:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
})
router.put("/",authmiddleware,async (req,res)=>{
    const {success}=updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            msg:"Error while updating information"
        })
    }
    await User.updateOne(req.body,{
        id:req.userId
    })
    res.json({
        msg:"Updated successfully"
    })
})

router.get("/all",async (req,res)=>{
    const filter=req.query.filter||"";
    const users=await User.find({
        $or:[{
            firstName:{
                "$regex":filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }]
    })
    res.json({
        user:users.map(user=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })
})
module.exports=router