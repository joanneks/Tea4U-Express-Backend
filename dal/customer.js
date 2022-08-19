const { Customer } = require('../models');


async function getAllCustomers () {
    const customers = await Customer.collection().fetch({});
    return customers;
};

async function getCustomerByEmailAndPassword (email,password) {
    const customer = await Customer.where({
        email:email,
        password:password
    }).fetch({
        require: false
    })
    return customer
}


async function getCustomerByEmail (email) {
    const customer = await Customer.where({
        email:email
    }).fetch({
        require: false
    })
    return customer
}

module.exports = { getAllCustomers,getCustomerByEmailAndPassword, getCustomerByEmail};