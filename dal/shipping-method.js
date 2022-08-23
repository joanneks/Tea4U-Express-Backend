const { ShippingMethod } = require('../models');

async function getAllShippingMethods () {
    const shippingMethods = await ShippingMethod.fetchAll({}).map(shippingMethod => {
        return [shippingMethod.get('id'),shippingMethod.get('name')];
    });
    return shippingMethods;
}

async function getAllShippingRates () {
    const shippingMethods = await ShippingMethod.collection().fetch({});
    return shippingMethods;
}

// async function getAllOrderStatuses () {
//     const orderStatuses = await OrderStatus.fetchAll({}).map(orderStatus => {
//         return [orderStatus.get('id'),orderStatus.get('name')];
//     });
//     return orderStatuses;
// }

async function getShippingMethodById (shippingMethodId) {
    const shippingMethod = await ShippingMethod.where({id:shippingMethodId}).fetch({
        require:true
    })
    return shippingMethod;
}

async function getShippingMethodByPrice (shippingMethodPrice) {
    const shippingMethod = await ShippingMethod.where({price:shippingMethodPrice}).fetch({
        require:true
    })
    return shippingMethod;
}

module.exports = {getAllShippingMethods, getAllShippingRates, getShippingMethodById, getShippingMethodByPrice};