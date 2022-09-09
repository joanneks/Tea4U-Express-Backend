const { Order } = require('../models');

async function getAllOrders () {
    const orders = await Order.collection().fetch({
        withRelated:['user','orderStatus','shippingMethod']});
    return orders;
}

async function getOrderById (orderId) {
    const order = await Order.where({id:orderId}).fetch({
        require:false,
        withRelated:['user','orderStatus','shippingMethod','orderItem']
    })
    return order;
}

async function getOrdersByCustomerId (userId) {
    const order = await Order.where({customer_id:userId}).orderBy('datetime_created', 'DESC').fetchAll({
        require:false,
        withRelated:['user','orderStatus','shippingMethod','orderItem']
    })
    console.log('ORDERSS',order)
    return order;
}
module.exports = {getAllOrders, getOrderById, getOrdersByCustomerId };