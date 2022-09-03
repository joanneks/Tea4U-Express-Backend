const jwt = require("jsonwebtoken");

const checkIfAuthenticated = function (req,res,next) {
    const user = req.session.user;
    if (!user) {
        req.flash('error_messages', 'Only logged in users may view this page');
        res.redirect('/user/login')
    } else {
        next();
    }
} 

const checkIfAuthenticatedJWT = function(req,res,next){
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if(authHeader){
        const token =authHeader.split(" ")[1];
        console.log(token);
        console.log(process.env.TOKEN_SECRET)
        jwt.verify(token, process.env.TOKEN_SECRET, function(err,tokenData){
            if(err){
                res.status(401);
                res.json({
                    'error': "Invalid access token"
                })
            } else{
                // if token is valid, save the user in req.user
                req.customer = tokenData,
                next()
            }
        })
        // next();
    }else{
        res.status(401);
        res.json({
            'error':"No authorisation headers found"
        })
    }
}

module.exports = {checkIfAuthenticated,checkIfAuthenticatedJWT};