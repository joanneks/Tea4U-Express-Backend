const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Customer } = require('../../models');
const moment = require('moment');
const momentTimezone = require('moment-timezone');
// const { checkIfAuthenticatedJWT } = require('../../middlewares');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
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
    const password = req.body.password;
    const shippingAddress = req.body.shipping_address;
    const postalCode = req.body.postal_code;
    const mobileNumber = req.body.mobile_number;

    function validateLength (fieldValue,lowerLimit,upperLimit){
        if(fieldValue.length>lowerLimit && fieldValue.length<upperLimit){
            validationStatus.push(true);
        }else{
            validationStatus.push(false);
        }
    }
    validateLength(firstName,3,30);
    validateLength(lastName,3,30);
    validateLength(username,3,30);
    validateLength(email,3,50);
    validateLength(password,8,100);
    validateLength(shippingAddress,5,100);
    validateLength(postalCode,5,7);
    validateLength(mobileNumber,7,9);
    console.log(validationStatus);

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

module.exports = router;