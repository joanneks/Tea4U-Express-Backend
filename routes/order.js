const express = require('express');
const router = express.Router();
const { Order } = require('../models');
const { editOrderForm, createSearchOrderForm, bootstrapField } = require('../forms')
const orderDataLayer = require('../dal/order');
const orderItemsDataLayer = require('../dal/order-items');
const orderStatusDataLayer = require('../dal/order-status');
const brandDataLayer = require('../dal/brand');
const customerDataLayer = require('../dal/customer');
const shippingMethodDataLayer = require('../dal/shipping-method');
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const {checkIfAuthenticated} = require('../middlewares');

router.get('/', checkIfAuthenticated, async function(req,res){
    const orders = await orderDataLayer.getAllOrders();
    const orderStatuses = await orderStatusDataLayer.getAllOrderStatusesOption();
    const shippingMethods = await shippingMethodDataLayer.getAllShippingMethods();

    let query = Order.collection();

    orderStatuses.unshift([0, '--- All Order Status ---']);
    shippingMethods.unshift([0, '--- All Shipping Methods ---']);
    const searchOrderForm = createSearchOrderForm(orderStatuses,shippingMethods);
    
    searchOrderForm.handle(req,{
        'success':async function (searchOrderForm){
            if(process.env.DB_DRIVER == "mysql"){
                if(searchOrderForm.data.order_id){
                    query.where('id','=',searchOrderForm.data.order_id);
                };
                // if(searchOrderForm.data.email){
                //     query.join('customers','customer_id','customers.id').where('customer.email','=',searchOrderForm.data.email);
                // };
                if(searchOrderForm.data.order_status_id && searchOrderForm.data.order_status_id != 0){
                    query.where('order_status_id', '=', searchOrderForm.data.order_status_id);
                };
                if(searchOrderForm.data.shipping_method_id && searchOrderForm.data.shipping_method_id != 0){
                    query.where('shipping_method_id', '=', searchOrderForm.data.shipping_method_id);
                };

                const orderSearchResult = await query.fetch({
                    withRelated:['orderStatus','shippingMethod','user']
                });

                res.render('order/index',{
                    form:searchOrderForm.toHTML(bootstrapField),
                    orders:orderSearchResult.toJSON(),
                })
            }
        },
        'empty':async function(){
            res.render('order/index',{
                form:searchOrderForm.toHTML(bootstrapField),
                orders:orders.toJSON(),
            })
        },
        'error': async function(){
            res.render('order/index',{
                form:searchOrderForm.toHTML(bootstrapField),
                orders:orders.toJSON(),
            })
        }
    })
})


router.get('/edit/:order_id', checkIfAuthenticated, async function(req,res){
    const order = await orderDataLayer.getOrderById(req.params.order_id);
    const orderStatuses = await orderStatusDataLayer.getAllOrderStatusesOption();
    const shippingMethods = await shippingMethodDataLayer.getAllShippingMethods();

    const orderItems = await orderItemsDataLayer.getOrderItemsByOrderId(req.params.order_id);
    const customer = await customerDataLayer.getCustomerById(order.get('customer_id'));
    const label = "Customer ID - " + customer.toJSON().first_name + " " + customer.toJSON().last_name;

    let brandArray = [];
    for(each of orderItems.toJSON()){
        let brand = await brandDataLayer.getBrandById(each.tea.brand_id);
        brandArray.push({brand:brand.toJSON().name});
    }
    console.log('BRAND ARRAY',brandArray)
    console.log('BRAND ARRAY',orderItems)

    const orderForm = editOrderForm(orderStatuses,shippingMethods,label);

    orderForm.fields.shipping_address.value = order.get('shipping_address');
    orderForm.fields.postal_code.value = order.get('postal_code');
    orderForm.fields.remarks.value = order.get('remarks');
    orderForm.fields.shipping_method_id.value = order.get('shipping_method_id');
    orderForm.fields.order_status_id.value = order.get('order_status_id');
    // orderForm.fields.customer_id.value = order.get('customer_id');

    orderForm.handle(req,{
        'success':async function(orderForm){
            res.render('order/edit',{
                form:orderForm.toHTML(bootstrapField),
                brandArray:brandArray,
                orderId:req.params.order_id,
                order:order.toJSON(),
                orderItems:orderItems.toJSON()
            })
        },
        'empty':async function(orderForm){
            res.render('order/edit',{
                form:orderForm.toHTML(bootstrapField),
                brandArray:brandArray,
                orderId:req.params.order_id,
                order:order.toJSON(),
                orderItems:orderItems.toJSON()
            })
        },
        'error':async function(orderForm){
            res.render('order/edit',{
                form:orderForm.toHTML(bootstrapField),
                brandArray:brandArray,
                orderId:req.params.order_id,
                order:order.toJSON(),
                orderItems:orderItems.toJSON()
            })
        }
    })
})

router.post('/edit/:order_id', checkIfAuthenticated, async function(req,res){
    const order = await orderDataLayer.getOrderById(req.params.order_id);
    const orderStatuses = await orderStatusDataLayer.getAllOrderStatuses();
    const shippingMethods = await shippingMethodDataLayer.getAllShippingMethods();

    const orderForm = editOrderForm(orderStatuses,shippingMethods);

    const orderItems = await orderItemsDataLayer.getOrderItemsByOrderId(req.params.order_id);
    console.log(orderItems.toJSON());

    orderForm.handle(req,{
        'success':async function(orderForm){
            const orderModifiedDate = moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');
            order.set('datetime_last_modified',orderModifiedDate);
            order.set(orderForm.data);
            await order.save();

            req.flash('success_messages',"Order "+req.params.order_id+" updated successfully");
            res.redirect('/order');
        },
        'empty':async function(orderForm){
            res.render('order/edit',{
                form:orderForm.toHTML(bootstrapField),
                order:order.toJSON(),
                orderItems:orderItems.toJSON()
            })
        },
        'error':async function(orderForm){
            res.render('order/edit',{
                form:orderForm.toHTML(bootstrapField),
                order:order.toJSON(),
                orderItems:orderItems.toJSON()
            })
        }
    })
})

router.get('/delete/:order_id', checkIfAuthenticated, async function (req,res){
    const order = await orderDataLayer.getOrderById(req.params.order_id);
    order.destroy();
    req.flash('success_messages',"Order "+req.params.order_id+" deleted");
    res.redirect('/order');
})

module.exports = router;