const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const User=require('../models/user');
const passport = require('passport');
const client=require('twilio')(process.env.accountSid,process.env.authToken);
const isLoggedIn=require('../middlewares/isLoggedIn');

router.post('/start',(req,res)=>{
    client
         .verify
         .services(process.env.serviceId)
         .verifications
         .create({
             to: req.body.contactnumber,
             channel: 'sms'
         })
         .then((data)=>{
             res.status(200).send(data);
         })
         .catch((e)=>{
             console.log(e);
             res.status(e.status).send(e);
         });
})

router.post('/verify',(req,res)=>{
    client
        .verify
        .services(process.env.serviceId)
        .verificationChecks
        .create({
            to: req.body.contactnumber,
            code: req.body.code
        })
        .then((data)=>{
            const dt=JSON.parse(data);
            console.log(dt);
        })
        .catch((e)=>{
            res.status(e.status).send(e.message);
        })

})

router.post('/signup',async(req,res)=>{
    try{
       const hashedPassword=await bcrypt.hash(req.body.password,10);
       req.body.password=hashedPassword;
       await User.create(req.body);
       res.status(200).send('User created successfully');
    }catch(e){
        console.log(e);
        if(e.name==="MongoError"&&e.code===11000){
            res.status(402).send('account already registered with this email')
        }else{
        res.send(e.message);
        }
    }
    
});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',function(err,user,info){
        if(err){return res.status(400).send(err.message)}
        if(!user){return res.status(404).send('incorrect password or number')}
        req.logIn(user, function(err) {
            if (err) { return res.status(401).send(err.message); }
            return res.status(200).send('login successful');
          });
    })(req,res,next);
    

})


router.get('/logout',(req,res)=>{
    try{
        req.logout();
        res.status(200).send('logged out successfully');
    }catch(e){
        console.log(e.message);
        res.send(e.message);
    }
})




// router.post('/login',
//     passport.authenticate('local',
//         {
//             failureRedirect: '/login',
//             failureFlash: true
//         }

//     ), (req, res) => {
//         res.send('login successful');
// });


router.patch('/changepassword',isLoggedIn,async(req,res)=>{
    try{
        const{oldpassword,newpassword}=req.body;
        if(bcrypt.compare(oldpassword,req.user.password)){
            const hashedPassword=await bcrypt.hash(newpassword,10);
            await User.updateOne({_id:req.user._id},{password:hashedPassword});
            res.status(200).send('password updated successfully');
        }else{
            res.status(404).send('You have entered an invalid password');
        }
    }catch(e){
        res.status(e.status).send(e.message);
    }

})

// router.patch('/changepassword',isLoggedIn,(req,res)=>{
//     const {oldpassword,newpassword}=req.body;
//     bcrypt.compare(oldpassword,req.user.password)
//     .then(()=>{
//         const hashedPassword=bcrypt.hash(newpassword,10);
//     })
//     .then(()=>{
//         User.updateOne({_id:req.user._id},{password:hashedPassword})
//     })
//     .then(()=>{
//         res.status(200).send('password changed successfully');
//     })
//     .catch((e)=>{
//         res.status(e.status).send(e.message);
//     })
// })


module.exports=router; 