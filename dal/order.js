const { Order } = require('../models');

async function getAllOrders () {
    const orders = await Order.collection().fetch({
        withRelated:['user','orderStatus','shippingMethod']});
    return orders;
}

async function getOrderById (orderId) {
    const order = await Order.where({id:orderId}).fetch({
        require:true
    })
    return order;
}

module.exports = {getAllOrders, getOrderById};