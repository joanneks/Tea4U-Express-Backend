const express =require('express');
const router = express.Router();
const {createUserForm, editUserForm, editUserPasswordForm, bootstrapField} = require('../forms');
const dataLayer = require('../dal/user');
const {User} = require('../models');
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    // the output will be converted to hexdecimal
    const hash = sha256.update(password).digest('base64');
    return hash;
}


router.get('/',async function(req,res){
    const users = await dataLayer.getAllUsers();
    res.render('user/index',{
        'users':users.toJSON()
    });
});

router.get('/register',function(req,res){
    const userForm  = createUserForm();
    res.render('user/register',{
        'form': userForm.toHTML(bootstrapField)
    });
});

router.post('/register',function(req,res){
    const userForm  = createUserForm();
    const user = new User();
    userForm.handle(req,{
        'success':async function (userForm){
            const {confirm_password,...userFormData} = userForm.data;
            const userCreatedDate= moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');
            const userLastModifiedDate = userCreatedDate;
            userFormData.password = getHashedPassword(userFormData.password);
            console.log(userFormData.password);
            
            user.set('datetime_created',userCreatedDate);
            user.set('datetime_last_modified',userLastModifiedDate);
            user.set(userFormData);
            await user.save();
            res.redirect('/user');
        },
        'error':async function(userForm){
            res.render('user/register',{
                'form': userForm.toHTML(bootstrapField)
            });
        },
        'empty':async function(userForm){
            res.render('user/register',{
                'form': userForm.toHTML(bootstrapField)
            });
        }
    })
});

router.get('/edit/:user_id',async function(req,res){
    const user = await dataLayer.getUserById(req.params.user_id);
    const userForm  = editUserForm();
    // set field values from values last saved in database 
    userForm.fields.first_name.value = user.get('first_name');
    userForm.fields.last_name.value = user.get('last_name');
    userForm.fields.email.value = user.get('email');

    res.render('user/edit',{
        'form': userForm.toHTML(bootstrapField),
        'user':user.toJSON()
    });
})

router.post('/edit/:user_id',async function(req,res){
    const user = await dataLayer.getUserById(req.params.user_id);
    const userForm  = editUserForm();

    userForm.handle(req,{
        'success':async function(userForm){
            const userLastModifiedDate= moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');

            user.set(userForm.data);
            // user.set('password',user.get('password'));
            user.set('datetime_last_modified',userLastModifiedDate);
            await user.save();
            res.redirect('/user');
        },
        'error':async function(userForm){
            res.render('user/edit',{
                form:userForm.toHTML(bootstrapField)
            })
        },
        'empty':async function(userForm){
            res.render('user/edit',{
                form:userForm.toHTML(bootstrapField)
            })
        },
    })
})

router.get('/edit-password/:user_id',async function(req,res){
    const user = await dataLayer.getUserById(req.params.user_id);
    const userForm  = editUserPasswordForm();
    res.render('user/password',{
        'form': userForm.toHTML(bootstrapField),
        'user':user.toJSON()
    });
})

router.post('/edit-password/:user_id',async function(req,res){
    const user = await dataLayer.getUserById(req.params.user_id);
    const userForm  = editUserPasswordForm();
    userForm.handle(req,{
        'success':async function (userForm){
            const {former_password,confirm_password,userFormData} = userForm.data;
            const formerPassword = user.get('password');
            const formerPasswordUserInput = getHashedPassword(userForm.data.former_password);
            console.log('formerPasswordUserInput',formerPasswordUserInput);
            console.log('former-password',formerPassword);
            console.log(formerPasswordUserInput == formerPassword);
            console.log('userForm.data.password',userForm.data.password);
            const password = getHashedPassword(userForm.data.password);
            console.log(password);

            if(userForm.data.former_password == formerPassword){
                console.log('true condition met');
                console.log('---------',password);
                user.set('password',password);
                await user.save();
                res.redirect('/user');
            } else {
                res.render('user/password',{
                    'form': userForm.toHTML(bootstrapField),
                    'user':user.toJSON()
                });
            }
        },
        'error':async function (userForm){
            res.render('user/password',{
                'form': userForm.toHTML(bootstrapField),
                'user':user.toJSON()
            });
        },
        'empty':async function (userForm){
            res.render('user/password',{
                'form': userForm.toHTML(bootstrapField),
                'user':user.toJSON()
            });
        }
    })
})


router.get('/delete/:user_id',async function(req,res){
    const user = await dataLayer.getUserById(req.params.user_id);
    user.destroy();
    res.redirect('/user');
})

module.exports = router;