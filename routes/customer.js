const express =require('express');
const router = express.Router();
const {editCustomerForm, bootstrapField} = require('../forms');
const dataLayer = require('../dal/customer');
// const {Customer} = require('../models');
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const crypto = require('crypto');
const {checkIfAuthenticated} = require('../middlewares');


const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    // the output will be converted to hexdecimal
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.get('/', checkIfAuthenticated,async function (req,res){
    const customers = await dataLayer.getAllCustomers();
    res.render('customer/index',{
        'customers': customers.toJSON()
    });
});

router.get('/edit/:customer_id', checkIfAuthenticated,async function (req,res){
    const customerForm  = editCustomerForm();
    const customer = await dataLayer.getCustomerById(req.params.customer_id);
    customerForm.fields.first_name.value = customer.get('first_name');
    customerForm.fields.last_name.value = customer.get('last_name');
    customerForm.fields.username.value = customer.get('username');
    customerForm.fields.email.value = customer.get('email');
    customerForm.fields.password.value = customer.get('password');
    customerForm.fields.shipping_address.value = customer.get('shipping_address');
    customerForm.fields.postal_code.value = customer.get('postal_code');
    customerForm.fields.mobile_number.value = customer.get('mobile_number');

    customerForm.handle(req,{
        'success':async function(customerForm){
            res.render('customer/edit',{
                'form': customerForm.toHTML(bootstrapField),
                'customer':customer.toJSON()
            });
        },
        'error':async function(customerForm){
            res.render('customer/edit',{
                'form': customerForm.toHTML(bootstrapField),
                'customer':customer.toJSON()
            });
        },
        'empty':async function(customerForm){
            res.render('customer/edit',{
                'form': customerForm.toHTML(bootstrapField),
                'customer':customer.toJSON()
            });
        },
    })
})

router.post('/edit/:customer_id', checkIfAuthenticated,async function (req,res){
    const customerForm  = editCustomerForm();
    const customer = await dataLayer.getCustomerById(req.params.customer_id);

    customerForm.handle(req,{
        'success':async function(customerForm){
            let {passwordInput,...customerFormData} = customerForm.data;
            let password = getHashedPassword(passwordInput);
            // const customerCreatedDate = customer.get('datetime_created');
            const customerLastModifiedDate = moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');

            customer.set(customerFormData);
            customer.set('password',password);
            customer.set('datetime_last_modified',customerLastModifiedDate);
            await customer.save();
            res.render('customer/edit',{
                'form': customerForm.toHTML(bootstrapField),
                'customer':customer.toJSON()
            });
        },
        'error':async function(customerForm){
            res.render('customer/edit',{
                'form': customerForm.toHTML(bootstrapField),
                'customer':customer.toJSON()
            });
        },
        'empty':async function(customerForm){
            res.render('customer/edit',{
                'form': customerForm.toHTML(bootstrapField),
                'customer':customer.toJSON()
            });
        },
    })
})


router.get('/delete/:customer_id', checkIfAuthenticated, async function (req,res){
    const customer = await dataLayer.getCustomerById(req.params.customer_id);
    customer.destroy();
    req.flash('success_messages',"Customer "+req.params.customer_id+" has been deleted");
    res.redirect('/brand');
})

module.exports = router;