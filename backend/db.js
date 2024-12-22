const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://admin:ItVevP4RNXCSaMWn@cluster0.5pgqe.mongodb.net/paytm");

//user schema
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    }
})

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})

const Account=mongoose.model('Account',accountSchema);
const User=mongoose.model('User',userSchema);
module.exports={
    User,
    Account
};