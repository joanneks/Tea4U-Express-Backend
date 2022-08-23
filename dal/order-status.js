const { OrderStatus } = require('../models');

async function getAllOrderStatusesOption () {
    const orderStatuses = await OrderStatus.fetchAll({}).map(orderStatus => {
        return [orderStatus.get('id'),orderStatus.get('name')];
    });
    return orderStatuses;
}


async function getAllOrderStatuses () {
    const orderStatuses = await OrderStatus.collection().fetch({});
    return orderStatuses;
}

async function getOrderStatusById (orderStatusId) {
    const orderStatus = await OrderStatus.where({id:orderStatusId}).fetch({
        require:true
    })
    return orderStatus;
}

module.exports = {getAllOrderStatuses, getOrderStatusById};