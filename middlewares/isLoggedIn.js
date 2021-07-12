function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.status(401).send('you need to login first');
    }
}

module.exports=isLoggedIn