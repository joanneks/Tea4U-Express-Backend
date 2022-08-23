const express = require('express');
const router = express.Router();
const { editOrderForm, bootstrapField } = require('../forms')
const orderDataLayer = require('../dal/order');
const orderStatusDataLayer = require('../dal/order-status');
const shippingMethodDataLayer = require('../dal/shipping-method');
const customerDataLayer = require('../dal/customer');
const moment = require('moment');
const momentTimezone = require('moment-timezone');

router.get('/',async function(req,res){
    const orders = await orderDataLayer.getAllOrders();
    // const customer = await customerDataLayer.get
    res.render('order/index',{
        orders:orders.toJSON()
    })
})


router.get('/edit/:order_id',async function(req,res){
    const order = await orderDataLayer.getOrderById(req.params.order_id);
    const orderStatuses = await orderStatusDataLayer.getAllOrderStatuses();
    const shippingMethods = await shippingMethodDataLayer.getAllShippingMethods();

    const orderForm = editOrderForm(orderStatuses,shippingMethods);

    orderForm.fields.shipping_address.value = order.get('shipping_address');
    orderForm.fields.postal_code.value = order.get('postal_code');
    orderForm.fields.remarks.value = order.get('remarks');
    orderForm.fields.shipping_method_id.value = order.get('shipping_method_id');
    orderForm.fields.order_status_id.value = order.get('order_status_id');
    orderForm.fields.customer_id.value = order.get('customer_id');
    orderForm.handle(req,{
        'success':async function(orderForm){
            res.render('order/edit',{
                form:orderForm.toHTML(bootstrapField),
                order:order.toJSON()
            })
        },
        'empty':async function(orderForm){
            res.render('order/edit',{
                form:orderForm.toHTML(bootstrapField),
                order:order.toJSON()
            })
        },
        'error':async function(orderForm){
            res.render('order/edit',{
                form:orderForm.toHTML(bootstrapField),
                order:order.toJSON()
            })
        }
    })
})

router.post('/edit/:order_id',async function(req,res){
    const order = await orderDataLayer.getOrderById(req.params.order_id);
    const orderStatuses = await orderStatusDataLayer.getAllOrderStatuses();
    const shippingMethods = await shippingMethodDataLayer.getAllShippingMethods();

    const orderForm = editOrderForm(orderStatuses,shippingMethods);

    orderForm.handle(req,{
        'success':async function(orderForm){
            const orderCreatedDate = order.get('datetime_created');
            const orderModifiedDate = moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');
            order.set('datetime_created',orderCreatedDate);
            order.set('datetime_last_modified',orderModifiedDate);
            order.set(orderForm.data);
            await order.save();

            req.flash('success_messages',"Order "+req.params.order_id+" updated successfully");
            res.redirect('/order');
        },
        'empty':async function(orderForm){
            res.render('order/edit',{
                form:orderForm.toHTML(bootstrapField),
                order:order.toJSON()
            })
        },
        'error':async function(orderForm){
            res.render('order/edit',{
                form:orderForm.toHTML(bootstrapField),
                order:order.toJSON()
            })
        }
    })
})

router.get('/delete/:order_id', async function (req,res){
    const order = await orderDataLayer.getOrderById(req.params.order_id);
    order.destroy();
    req.flash('success_messages',"Order "+req.params.order_id+" deleted");
    res.redirect('/order');
})

module.exports = router;