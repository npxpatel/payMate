const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://niraj:Niraj%407860@cluster0.b6c9t3k.mongodb.net/user")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        minLength:3,
    },
    password:{
        type:String,
        required:true,
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    }
})

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        //must exist and entry in user for creation of account
    },
    balance:{
        type:Number,
        required:true,
    }
})

const User=new mongoose.model("User", userSchema);
const Account=new mongoose.model("Account",accountSchema);

module.exports={
    User,
    Account,
}