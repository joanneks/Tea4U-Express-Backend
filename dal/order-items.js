const { OrderItem } = require('../models');

async function getOrderItemsByOrderId (orderId) {
    const orderItems = await OrderItem.where({order_id:orderId
    }).fetchAll({
        require:true,
        withRelated:['order','tea']
    })
    return orderItems;
}

module.exports = { getOrderItemsByOrderId};