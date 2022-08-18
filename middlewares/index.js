const { jwt } = require("jsonwebtoken");

const checkIfAuthenticated = function (req,res,next) {
    const user = req.session.user;
    if (!user) {
        req.flash('error_messages', 'Only logged in users may view this page');
        res.redirect('/user/login')
    } else {
        next();
    }
} 

// const checkIfAuthenticatedJWT = function (req,res,next){
//     const authHeader =req.headers.authorization;
//     console.log(authHeader);
//     if(authHeader){
//         const token = authHeader.split("")[1];
//         jwt.verify(token,process.env.TOKEN_SECRET,function (err,tokenData){
//             if(err){
//                 res.status(401);
//                 res.json({
//                     'error':'Invalid access token'
//                 })
//             }else{
//                 req.user = tokenData;
//                 next();
//             }
//         })
//         next();
//     }else{
//         res.status(401);
//         res.json({
//             'error':'No authorisation headers found'
//         })
//     }
// }

const checkIfAuthenticatedJWT = function(req,res,next){
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if(authHeader){
        // extract out the JWT and check whether it is valid
        // example authHeader => BEARER "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imxlbmd6YWkxIiwiaWQiOjEsImVtYWlsIjoibGVuZ3phaTFAZ21haWwuY29tIiwiaWF0IjoxNjU5NDk4Mzc2LCJleHAiOjE2NTk1MDE5NzZ9.PhHFXE92YKZwYa3MgBzrQFmo28aY5DQYvNe8FmAqweE"
        const token =authHeader.split(" ")[1];
        jwt.verify (token, process.env.TOKEN_SECRET, function(err,tokenData){
            // err argument -- is null if there is no error
            // tokenData arg -- is the data that we embed
            if(err){
                res.status(401);
                res.json({
                    'error': "Invalid access token"
                })
            } else{
                // if token is valid, save the user in req.user
                req.user = tokenData,
                next()
            }
        })
        next();
    }else{
        res.status(401);
        res.json({
            'error':"No authorisation headers found"
        })
    }
}

module.exports = {checkIfAuthenticated,checkIfAuthenticatedJWT};