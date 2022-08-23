const { ShippingMethod } = require('../models');

async function getAllShippingMethods () {
    const shippingMethods = await ShippingMethod.collection().fetch({});
    return shippingMethods;
}

async function getShippingMethodById (shippingMethodId) {
    const shippingMethod = await ShippingMethod.where({id:shippingMethodId}).fetch({
        require:true
    })
    return shippingMethod;
}

module.exports = {getAllShippingMethods, getShippingMethodById};