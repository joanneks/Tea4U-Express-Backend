const express =require('express');
const router = express.Router();
const {createUserForm, editUserForm, editUserPasswordForm, createLoginForm, bootstrapField} = require('../forms');
const dataLayer = require('../dal/user');
const {User} = require('../models');
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

router.get('/logout', function(req,res){
    req.session.user = null;
    req.flash('success_messages', "You have successfully logged out");
    res.redirect('/user/login');
})

router.get('/login', async function (req,res){
    console.log('hello')
    console.log(createLoginForm)
    const loginForm = createLoginForm();
    res.render('user/login',{
        form:loginForm.toHTML(bootstrapField)
    })
})

router.post('/login',  async function (req,res){
    const loginForm = createLoginForm();
    loginForm.handle(req,{
        'success':async function(loginForm){
            const user = await User.where({
                email: loginForm.data.email,
                password: getHashedPassword(loginForm.data.password)
            }).fetch({
                require:false
            })
            if(!user){
                req.flash('error_messages', "Invalid credentials");
                res.redirect("/user/login");
            } else {
                req.session.user = {
                    id: user.get('id'),
                    email: user.get('email'),
                    username: user.get('username')
                }
                req.flash('success_messages', 'Welcome back, ' + user.get('username'));
                res.redirect('/tea');
            }
        },
        'error':async function(loginForm){
            res.render('user/login',{
                form:loginForm.toHTML(bootstrapField),
                message:"Login required"
            })
        },
        'empty':async function(loginForm){
            res.render('user/login',{
                form:loginForm.toHTML(bootstrapField)
            })
        },
    })
})

router.get('/register', function(req,res){
    const userForm  = createUserForm();
    res.render('user/register',{
        'form': userForm.toHTML(bootstrapField)
    });
});

router.post('/register', function(req,res){
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
            req.flash('success_messages', "You have signed up successfully");
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

router.get('/', checkIfAuthenticated, async function(req,res){
    const users = await dataLayer.getAllUsers();
    res.render('user/index',{
        'users':users.toJSON()
    });
});

router.get('/edit/:user_id', checkIfAuthenticated, async function(req,res){
    const user = await dataLayer.getUserById(req.params.user_id);
    const userForm  = editUserForm();
    // set field values from values last saved in database 
    userForm.fields.first_name.value = user.get('first_name');
    userForm.fields.last_name.value = user.get('last_name');
    userForm.fields.username.value = user.get('username');
    userForm.fields.email.value = user.get('email');

    res.render('user/edit',{
        'form': userForm.toHTML(bootstrapField),
        'user':user.toJSON()
    });
})

router.post('/edit/:user_id', checkIfAuthenticated, async function(req,res){
    const user = await dataLayer.getUserById(req.params.user_id);
    const userForm  = editUserForm();

    userForm.handle(req,{
        'success':async function(userForm){
            const userLastModifiedDate= moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');

            user.set(userForm.data);
            // user.set('password',user.get('password'));
            user.set('datetime_last_modified',userLastModifiedDate);
            await user.save();
            req.flash('success_messages',"User details updated successfully");
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

router.get('/edit-password/:user_id', checkIfAuthenticated, async function(req,res){
    const user = await dataLayer.getUserById(req.params.user_id);
    const userForm  = editUserPasswordForm();
    res.render('user/password',{
        'form': userForm.toHTML(bootstrapField),
        'user':user.toJSON()
    });
})

router.post('/edit-password/:user_id', checkIfAuthenticated, async function(req,res){
    const user = await dataLayer.getUserById(req.params.user_id);
    const userForm  = editUserPasswordForm();
    userForm.handle(req,{
        'success':async function (userForm){
            const {former_password,confirm_password,userFormData} = userForm.data;
            const formerPassword = user.get('password');
            const formerPasswordUserInput = getHashedPassword(userForm.data.former_password);
            console.log(formerPasswordUserInput == formerPassword);
            console.log('userForm.data.password',userForm.data.password);
            const password = getHashedPassword(userForm.data.password);
            console.log(password);

            if(formerPasswordUserInput == formerPassword){
                user.set('password',password);
                await user.save();
                req.flash('success_messages',"Password updated successfully");
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

router.get('/delete/:user_id', checkIfAuthenticated, async function(req,res){
    const user = await dataLayer.getUserById(req.params.user_id);
    user.destroy();
    req.flash('success_messages',"User has been deleted");
    res.redirect('/user');
})

module.exports = router;