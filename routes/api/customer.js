const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Customer } = require('../../models');
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const { checkIfAuthenticatedJWT } = require('../../middlewares');
const customerDataLayer = require('../../dal/customer');

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
    let errorMessages={};
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const username = req.body.username;
    const email = req.body.email;
    let password = req.body.password;
    const shippingAddress = req.body.shipping_address;
    const postalCode = req.body.postal_code;
    const mobileNumber = req.body.mobile_number;

    const existingCustomer = await customerDataLayer.getCustomerByEmail(email);

    // validate field values to have min and max characters.
    function validateLength (fieldValueKey,fieldValue,lowerLimit,upperLimit){
        if(fieldValue.length>=lowerLimit && fieldValue.length<=upperLimit){
            validationStatus.push(true);
        }else{
            validationStatus.push(false);
            errorMessages[fieldValueKey] = `Field Value must be between `+ lowerLimit + ` and ` + upperLimit + ` characters`;
        }
    }
    // validate email must include '@' and '.' and must not exist in database already
    function validateEmail(email){
        if(existingCustomer){
            if(existingCustomer.get('email') == email){
                validationStatus.push(false);
                errorMessages.emailExist = "An account with this email already exists";
                
            }
        }else{
            if(email.includes('@') && email.includes('.')){
                validationStatus.push(true);
            }else{
                validationStatus.push(false);
                errorMessages.emailInvalid = `Email needs to have "@" and "."`;
            }
        }
    }
    // validate mobile number start with 8,9
    function validateMobile(mobileNumber){
        if(mobileNumber[0]==8 || mobileNumber[0]==9){
            validationStatus.push(true);
        }else{
            validationStatus.push(false);
            errorMessages.mobileInvalid = `SG mobile numbers need to start with 8 or 9.`;
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
            errorMessages.passwordSpecialCheckInvalid = `Password needs to contain at least 1 special character: '!','@','#','$','%'`;
        }

        if(password.toLowerCase()!=password && password.toUpperCase()!=password){
            validationCheck.push(true);
        }else{
          validationCheck.push(false);
          errorMessages.passwordCapitalCheckInvalid = `Password needs to contain at least 1 uppercase alphabet`;
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
            errorMessages.passwordNumberCheckInvalid = `Password needs to be alphanumeric with at least 1 number.`;
        };

        if(!validationCheck.includes(false)){
            validationStatus.push(true);
        }else{
            validationStatus.push(false);
        }

    };
    validateLength('firstName',firstName,3,30);
    validateLength('lastName',lastName,3,30);
    validateLength('username',username,3,30);
    validateLength('email',email,3,50);
    validateLength('password',password,8,30);
    validateLength('shippingAddress',shippingAddress,5,100);
    validateLength('postalCode',postalCode,6,6);
    validateLength('mobileNumber',mobileNumber,8,8);
    validateEmail(email);
    validateMobile(mobileNumber);
    validatePassword(password);
    
    console.log(validationStatus,errorMessages);

    password = getHashedPassword(password);

    if(validationStatus.includes(false)){
        res.status(200);
        res.json({
            message:'Failed to create customer in mysql database',
            errorMessages
        })
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

router.post('/edit', checkIfAuthenticatedJWT,async function (req,res){
    const customerLastModifiedDate = moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');

    let validationStatus = [];
    let errorMessages={};
    
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const username = req.body.username;
    const email = req.body.email;
    // let existingPassword = req.body.existing_password;
    let password = getHashedPassword(req.body.password);
    const shippingAddress = req.body.shipping_address;
    const postalCode = req.body.postal_code;
    const mobileNumber = req.body.mobile_number;
    console.log(mobileNumber)
    console.log(postalCode)

    try{
        const existingCustomer = await customerDataLayer.getCustomerByEmail(email);
        const existingCustomerPassword = existingCustomer.get("password");

        // if(existingCustomerPassword==existingPassword){
        if(existingCustomerPassword==password){
            // validate field values to have min and max characters.
            function validateLength (fieldValueKey,fieldValue,lowerLimit,upperLimit){
                if(fieldValue.length>=lowerLimit && fieldValue.length<=upperLimit){
                    validationStatus.push(true);
                }else{
                    validationStatus.push(false);
                    errorMessages[fieldValueKey] = `Field Value must be between `+ lowerLimit + ` and ` + upperLimit + ` characters`;
                }
            }
            // validate mobile number start with 8,9
            function validateMobile(mobileNumber){
                console.log(mobileNumber[0])
                if(mobileNumber[0]==8 || mobileNumber[0]==9){
                    console.log('mobilecheck',mobileNumber[0]==9)
                    validationStatus.push(true);
                }else{
                    validationStatus.push(false);
                    errorMessages.mobileInvalid = `SG mobile numbers need to start with 8 or 9.`;
                }
            }
            function validateNumbers(fieldValueKey,fieldValue){
                if(isNaN(fieldValue)){
                    validationStatus.push(false);
                    errorMessages[fieldValueKey] = `Field Value can only consist of numbers`;
                } else{
                    validationStatus.push(true);
                }
            }
            validateNumbers('postalNumberCheck',postalCode);
            validateNumbers('mobileNumberCheck',mobileNumber);
            validateLength('firstName',firstName,3,30);
            validateLength('lastName',lastName,3,30);
            validateLength('username',username,3,30);
            validateLength('shippingAddress',shippingAddress,5,100);
            validateLength('postalCode',postalCode,6,6);
            validateLength('mobileNumber',mobileNumber,8,8);
            validateMobile(mobileNumber);
            
            console.log(validationStatus,errorMessages);
            password = getHashedPassword(password);
            
            let modifiedCustomerDetails = {
                first_name:firstName,
                last_name:lastName,
                username:username,
                shipping_address:shippingAddress,
                postal_code:postalCode,
                mobile_number:mobileNumber
            }

            if(validationStatus.includes(false)){
                res.status(200);
                res.json({
                    message:'Failed to update customer details in mysql database',
                    errorMessages
                })
            } else{    
                try{
                    console.log('mango')
                    existingCustomer.set('first_name',firstName);
                    existingCustomer.set('last_name',lastName);
                    console.log('lychee')
                    existingCustomer.set('username',username);
                    existingCustomer.set('shipping_address',shippingAddress);
                    existingCustomer.set('postal_code',postalCode);
                    existingCustomer.set('mobile_number',mobileNumber);
                    existingCustomer.set('datetime_last_modified',customerLastModifiedDate);
                    await existingCustomer.save();
                    console.log('Customer details updated')
                    res.status(200);
                    res.json({
                        modifiedCustomerDetails,
                        errorMessages,
                        updatedStatus:true
                });
                }catch(e){
                    res.status(500);
                    res.json('Failed to update customer details in mysql database'),
                    errorMessages
                }
                
            }
        }else{
            errorMessages['password'] = `Password does not match existing password`;
        
            let message = "Password does not match existing account created with "+email+" in database";
            res.status(200);
            res.json({
                message,
                errorMessages
            })
        }

    }catch(e){
        res.status(400);
        res.json({
            message:"Email or password is invalid"
        })
    }

            // validateLength('password',password,8,30);
            // validate password for special characters,number and 1 uppercase alphabet
            // function validatePassword(password){
            //     // push true if criteria is met into validationCheck
            //     const validationCheck =[]
        
            //     // 1. check if special characters exist in password
            //     // 2. check if password has 1 uppercase
            //     // 3. check if password is alphanumeric
            //     // flaw. alphanumeric test is still true 
            //     // if the password is made up of numbers and special characters without alphabets. 
            //     // But this code will still work because this fringe case will fail the capital letter check (test 2)
        
            //     const specialCharacters = ['!','@','#','$','%'];
            //     let specialCheck = [];
            //     for (let i=0;i<specialCharacters.length;i++){
            //     if(password.includes(specialCharacters[i])){
            //         specialCheck.push(true);
            //     }
            //     }
            //     if(specialCheck.includes(true)){
            //         validationCheck.push(true);
            //     } else {
            //         validationCheck.push(false);
            //         errorMessages.passwordSpecialCheckInvalid = `Password needs to contain at least 1 special character: '!','@','#','$','%'`;
            //     }
        
            //     if(password.toLowerCase()!=password && password.toUpperCase()!=password){
            //         validationCheck.push(true);
            //     }else{
            //     validationCheck.push(false);
            //     errorMessages.passwordCapitalCheckInvalid = `Password needs to contain at least 1 uppercase alphabet`;
            //     }
        
            //     let numberCheck=[];
            //     let checkNumber="";
            
            //     for(let i = 0; i<password.length;i++){
            //         checkNumber = isNaN(parseInt(password[i]));
            //         if(checkNumber==true){
            //         numberCheck.push(true);
            //         } else{
            //         numberCheck.push(false);
            //         }
            //     };  
            //     if(numberCheck.includes(false) && numberCheck.includes(true)){
            //         validationCheck.push(true);
            //     } else {
            //         validationCheck.push(false);
            //         errorMessages.passwordNumberCheckInvalid = `Password needs to be alphanumeric with at least 1 number.`;
            //     };
        
            //     if(!validationCheck.includes(false)){
            //         validationStatus.push(true);
            //     }else{
            //         validationStatus.push(false);
            //     }
        
            // };
            // validatePassword(password);
            // validate email must include '@' and '.' and must not exist in database already
            // function validateEmail(email){
            //     if(existingCustomer){
            //         if(existingCustomer.get('email') == email){
            //             validationStatus.push(false);
            //             errorMessages.emailExist = "An account with this email already exists";
                        
            //         }
            //     }else{
            //         if(email.includes('@') && email.includes('.')){
            //             validationStatus.push(true);
            //         }else{
            //             validationStatus.push(false);
            //             errorMessages.emailInvalid = `Email needs to have "@" and "."`;
            //         }
            //     }
            // }
            // validateLength('email',email,3,50);
            // validateEmail(email);

})

router.get('/profile', checkIfAuthenticatedJWT, async(req,res)=>{
    try{
        let customerId = req.customer.id;
        let customer = await customerDataLayer.getCustomerById(customerId)
        let customerDetails = customer.toJSON();
        customerDetails.password = '';
        res.status(200);
        res.send(customerDetails);
    } catch(e){
        res.status(403);
        res.send("Customer does not exist or JWT access token verification failed")
    }

})

router.post('/login',async function(req,res){
    const email = req.body.email;
    const password = getHashedPassword(req.body.password);
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
            '15m'
        )
        const refreshToken = generateAccessToken(
            customerUsername,
            customerId,
            customerEmail,
            process.env.REFRESH_TOKEN_SECRET,
            '1d'
        )
        req.session.customer = {
            username:customerUsername,
            id:customerId,
            email:customerEmail,
            // accessToken,
            // refreshToken
        }
        res.status(200);
        res.json({
            accessToken,
            refreshToken,
            userDetails:req.session.customer,
            message:'Login success'
        })
    } else {
        res.status(400);
        res.json({
            message:'Login request failed. Customer account does not exist'
        });
    }
})

router.post('/refresh', async function (req,res){
    // get the refresh token from the body - do not need to use the header for that
    const refreshToken = req.body.refreshToken;

    if(refreshToken){
        // verify if it is legit
        jwt.verify(refreshToken,
            process.env.REFRESH_TOKEN_SECRET,function (err,tokenData){
                if (!err){
                    // generate a new access token and send back
                    const accessToken = generateAccessToken(
                        tokenData.username, 
                        tokenData.id, 
                        tokenData.email, 
                        process.env.TOKEN_SECRET,
                        '1d'
                    )
                    res.json({
                        accessToken
                    })
                }else{
                    res. status(400);
                    res.json({
                        error:'Invalid refresh token'
                    })
                }
            })

    } else{
        res.status(400);
        res.json({
            error:'No refresh token found'
        })
    }
})


router.post('/logout',async function(req,res){
    const refreshToken = req.body.refreshToken
    if(refreshToken){
        jwt.verify(refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async function(err,tokenData){
            if(!err){
                res.json({
                    message:"RefreshToken found!",
                    message:"Logout success!"
                })
            }
        })
    } else{
        res.status(400);
        res.json({
            error:"No refresh token found!"
        })
    }
})

module.exports = router;