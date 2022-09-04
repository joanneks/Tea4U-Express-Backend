const express =require('express');
const router = express.Router();
const {createLoginForm, bootstrapField} = require('../forms');
const {User} = require('../models');
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    // the output will be converted to hexdecimal
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.get('/', async function (req,res){
    const loginForm = createLoginForm();
    res.render('landing',{
        form:loginForm.toHTML(bootstrapField)
    })
})
router.post('/', function(req,res){
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
            res.render('landing',{
                form:loginForm.toHTML(bootstrapField)
            })
        },
        'empty':async function(loginForm){
            res.render('landing',{
                form:loginForm.toHTML(bootstrapField)
            })
        },
    })
})
module.exports = router;