const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    contactnumber:{
        unique:true,
        required:true,
        type:Number
    },
    deviceid:{
        required:true,
        type:String
    },
    email:{
        type:String
    },
    name:{
        type:String
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String
    }
});

const User=new mongoose.model('User',userSchema);
module.exports=User;