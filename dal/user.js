const { User } = require('../models');

async function getAllUsers () {
    const users = await User.collection().fetch({});
    return users;
}

async function getUserById (userId) {
    const user = await User.where({id:userId}).fetch({
        require:true
    })
    return user;
}

module.exports = {getAllUsers, getUserById};