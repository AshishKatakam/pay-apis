
require('dotenv').config();
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const passport=require('passport');
const session=require('express-session');


const initializePassport=require('./utils/passportConfig');
initializePassport(passport);

const authRoutes=require('./routes/authentication');


mongoose.connect(process.env.DB_URL,
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})
.then(()=>{
    console.log('DB CONNECTED');
})
.catch((e)=>{
    console.log(e.message);
    console.log('DB connection error');
})


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret:'It is a bad secret',
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(authRoutes);


app.get('/',(req,res)=>{
    res.send('Hi folks');
})

app.listen(3000,()=>{
    console.log('server running on port 3000');
})