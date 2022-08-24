const { OrderItem } = require('../models');

async function getOrderItemsByOrderId (orderId) {
    const orderItems = await OrderItem.collection().where({order_id:orderId
    }).fetch({
        require:true,
        withRelated:['order','tea']
    })
    return orderItems;
}

module.exports = { getOrderItemsByOrderId};