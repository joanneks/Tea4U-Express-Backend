const express = require('express');
const router = express.Router();
const orderDataLayer = require('../../dal/order');
const orderItemsDataLayer = require('../../dal/order-items');
const {checkIfAuthenticatedJWT} = require('../../middlewares');

router.get('/:customer_id', checkIfAuthenticatedJWT, async function(req,res){
    let customerId = parseInt(req.params.customer_id)
    if(customerId ==req.customer.id){
        const orders = await orderDataLayer.getOrdersByCustomerId(parseInt(customerId));
        res.status(200);
        res.json({
            orders:orders.toJSON(),
            message:"Order Query success"
        })
    }else{
        res.status(400);
        res.send({
            error: "Order Query failed"
        })
    }

})

router.get('/:customer_id/:order_id', async function (req, res) {
    let customerId = parseInt(req.params.customer_id)
    if(customerId ==req.customer.id){
        let orderItems = await orderItemsDataLayer.getOrderItemsByOrderId(req.params.order_id);

        res.status(200);
        res.json({
            orderItems:orderItems.toJSON(),
            message:"Order Items Query success"
        })
    }
})

module.exports = router;