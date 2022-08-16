const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Customer, User } = require('../../models');
// const { checkIfAuthenticatedJWT } = require('../../middlewares');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.post('/create',function (req,res){
    const user = new User();
    
})

module.exports = router;