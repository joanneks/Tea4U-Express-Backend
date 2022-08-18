const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Customer } = require('../../models');
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const { checkIfAuthenticatedJWT } = require('../../middlewares');
const customerDataLayer = require('../../dal/customer');
const session = require('express-session');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}
const generateAccessToken = function (username, id, email,tokenSecret, expiry){
    return jwt.sign({
        username,id,email
    },tokenSecret,{
        expiresIn:expiry
    })
}

router.post('/create',async function (req,res){
    const customer = new Customer();
    const customerCreatedDate = moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');
    const customerLastModifiedDate = customerCreatedDate;
    
    let validationStatus = [];
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const username = req.body.username;
    const email = req.body.email;
    let password = req.body.password;
    const shippingAddress = req.body.shipping_address;
    const postalCode = req.body.postal_code;
    const mobileNumber = req.body.mobile_number;

    // validate field values to have min and max characters.
    function validateLength (fieldValue,lowerLimit,upperLimit){
        if(fieldValue.length>=lowerLimit && fieldValue.length<=upperLimit){
            validationStatus.push(true);
        }else{
            validationStatus.push(false);
        }
    }
    // validate email must include '@' and '.'
    function validateEmail(email){
        if(email.includes('@') && email.includes('.')){
            validationStatus.push(true);
        }else{
            validationStatus.push(false);
        }
    }
    // validate mobile number start with 8,9
    function validateMobile(mobileNumber){
        if(mobileNumber[0]==8 || mobileNumber[0]==9){
            validationStatus.push(true);
        }else{
            validationStatus.push(false);
        }
    }
    // validate password for special characters,number and 1 uppercase alphabet
    function validatePassword(password){
        // push true if criteria is met into validationCheck
        const validationCheck =[]

        // 1. check if special characters exist in password
        // 2. check if password has 1 uppercase
        // 3. check if password is alphanumeric
        // flaw. alphanumeric test is still true 
        // if the password is made up of numbers and special characters without alphabets. 
        // But this code will still work because this fringe case will fail the capital letter check (test 2)

        const specialCharacters = ['!','@','#','$','%'];
        let specialCheck = [];
        for (let i=0;i<specialCharacters.length;i++){
          if(password.includes(specialCharacters[i])){
            specialCheck.push(true);
          }
        }
        if(specialCheck.includes(true)){
            validationCheck.push(true);
        } else {
            validationCheck.push(false);
        }

        if(password.toLowerCase()!=password && password.toUpperCase()!=password){
            validationCheck.push(true);
        }else{
          validationCheck.push(false);
        }

        let numberCheck=[];
        let checkNumber="";
    
        for(let i = 0; i<password.length;i++){
            checkNumber = isNaN(parseInt(password[i]));
            if(checkNumber==true){
            numberCheck.push(true);
            } else{
            numberCheck.push(false);
            }
        };  
        if(numberCheck.includes(false) && numberCheck.includes(true)){
            validationCheck.push(true);
        } else {
            validationCheck.push(false);
        };

        if(!validationCheck.includes(false)){
            validationStatus.push(true);
        }else{
            validationStatus.push(false);
        }

    };
    validateLength(firstName,3,30);
    validateLength(lastName,3,30);
    validateLength(username,3,30);
    validateLength(email,3,50);
    validateLength(password,8,100);
    validateLength(shippingAddress,5,100);
    validateLength(postalCode,6,6);
    validateLength(mobileNumber,8,8);
    validateEmail(email);
    validateMobile(mobileNumber);
    validatePassword(password);
    
    console.log(validationStatus);

    password = getHashedPassword(password);

    if(validationStatus.includes(false)){
        res.status(400);
        res.json('Field values do not meet requirements to be inserted into database')
    } else{    
        try{
            const newCustomer = {
                first_name: firstName,
                last_name: lastName,
                username: username,
                email: email,
                password: password,
                shipping_address: shippingAddress,
                postal_code: postalCode,
                mobile_number: mobileNumber,
                datetime_created: customerCreatedDate,
                datetime_last_modified: customerLastModifiedDate
            };
            customer.set(newCustomer);
            await customer.save();
            console.log('Customer created')
            res.status(200);
            res.json(newCustomer);
        }catch(e){
            res.status(500);
            res.json('Failed to create customer in mysql database')
        }
        
    }

})

router.get('/',async function (req,res){
    const customers = await customerDataLayer.getAllCustomers();
    res.json(customers);
    res.status(200);
})

// router.get('/login-jwt', async function(req,res){
//     console.log('GET',req.jwt);
    // const email = req.session.jwt.email;
    // const password = getHashedPassword(req.session.jwt.password);
    // const customer = await customerDataLayer.getCustomerByEmailAndPassword(email,password);
    // console.log('GET',customer.toJSON());
    // res.json(customer.toJSON);
// })
router.get('/profile', checkIfAuthenticatedJWT, async(req,res)=>{
    const user = req.user;
    res.send(user);
})

router.post('/login',async function(req,res){
    const email = req.body.email;
    const password = getHashedPassword(req.body.password);
    console.log('POST',req.body.password,password)
    const customer = await customerDataLayer.getCustomerByEmailAndPassword(email,password);

    if(customer){
        const customerUsername = customer.get('username');
        const customerId = customer.get('id');
        const customerEmail = customer.get('email');
        const accessToken = generateAccessToken(
            customerUsername,
            customerId,
            customerEmail,
            process.env.TOKEN_SECRET,
            '1h'
        )
        const refreshToken = generateAccessToken(
            customerUsername,
            customerId,
            customerEmail,
            process.env.REFRESH_TOKEN_SECRET,
            '7d'
        )
        req.session.jwt = {
            username:customerUsername,
            id:customerId,
            email:customerEmail,
            accessToken,
            refreshToken
        }
        res.status(200);
        res.json({
            accessToken,
            refreshToken,
            message:'Login success'
        })
    } else {
        res.status(400);
        res.json({loginCheck});
    }
})

// router.post('/refresh', async function (req,res){
//     // get the refresh token from the body - do not need to use the header for that
//     const refreshToken = req.body.refreshToken;
//     if(refreshToken){
//         // checkif token is already blacklisted
//         const blacklistedToken = await BlacklistedToken.where({
//             token:refreshToken
//         }).fetch({
//             require:false
//         })

//         // if blacklisted token isnot null, then it means it exists
//         if(blacklistedToken){
//             res.status(400);
//             res.json({
//                 error:"Refresh token has been blacklisted"
//             })
//             return;
//         }

//         // verify if it is legit
//         jwt.verify(refreshToken,
//             process.env.REFRESH_TOKEN_SECRET,function (err,tokenData){
//                 if (!err){
//                     // generate a new access token and send back
//                     const accessToken = generateAccessToken(
//                         tokenData.username, 
//                         tokenData.id, 
//                         tokenData.email, 
//                         process.env.TOKEN_SECRET,
//                         '1h'
//                     )
//                     res.json({
//                         accessToken
//                     })
//                 }else{
//                     res. status(400);
//                     res.json({
//                         error:'Invalid refresh token'
//                     })
//                 }
//             })

//     } else{
//         res.status(400);
//         res.json({
//             error:'No refresh token found'
//         })
//     }
// })


router.post('/logout',async function(req,res){
    const refreshToken = req.body.refreshToken
    if(refreshToken){
        // if refreshToken exists we will add to blacklist table
        jwt.verify(refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async function(err,tokenData){
            if(!err){
                res.json({
                    message:"RefreshToken found!"
                })
            }
        })
    } else{
        // if not found
        res.status(400);
        res.json({
            error:"No refresh token found!"
        })
    }
})

module.exports = router;