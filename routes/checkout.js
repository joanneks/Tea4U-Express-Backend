const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    apiVersion:"2020-08-27"
});
const cartServiceLayer = require('../services/cart');
const teaDataLayer = require ('../dal/tea');
const teaServiceLayer = require ('../services/tea');
const shippingDataLayer = require ('../dal/shipping-method');
const {checkIfAuthenticated} = require('../middlewares');
const {OrderItem, Order} = require('../models');
const moment = require('moment');
const momentTimezone = require('moment-timezone');

router.get('/', checkIfAuthenticated,async function (req,res){
    try{
        const items = await cartServiceLayer.getCartByUserId(req.session.user.id);
        // const user = await userDataLayer.getUserById(req.session.user.id);
        // console.log(user);
        let lineItems = [];
        let meta = [];
        let paymentErrors= [];
        for(let item of items){
            let teaProduct = await teaDataLayer.getTeaById(item.get('tea_id'));
    
            let brandName = teaProduct.related('brand').get('name');
            let eachTeaName = item.related('tea').get('name');
            let eachTeaQuantity = item.get('quantity');
            // console.log('-hehe',brandName,eachTeaName,eachTeaQuantity);
            
            const eachLineItem={
                name:brandName+" - "+eachTeaName,
                amount:item.related('tea').get('cost'),
                quantity:eachTeaQuantity,
                currency:'SGD'
            };
            if(item.related('tea').get('image_url')){
                eachLineItem.images = [item.related('tea').get('image_url')]
            };
    
            let currentStockAvailability = teaProduct.get('quantity');
            console.log('currentStock',currentStockAvailability);
            if(currentStockAvailability >= eachTeaQuantity){
                lineItems.push(eachLineItem);
            } else {
                let message = "Insufficient stock for " +eachTeaName;
                let errorObject = {
                    message,
                    currentStockAvailability
                }
                paymentErrors.push(errorObject);
            }
    
            meta.push({
                tea_id:item.get('tea_id'),
                // cart_item_id:item.get('id'),
                quantity:item.get('quantity')
            });
        };
        
        let metaData = JSON.stringify(meta);
        let session = {
            payment_method_types:['card'],
            line_items:lineItems,
            success_url:process.env.STRIPE_SUCCESS_URL+"?sessionId={CHECKOUT_SESSION_ID}",
            cancel_url:process.env.STRIPE_CANCEL_URL,
            client_reference_id:req.session.user.id,
            customer_email:req.session.user.email,
            metadata:{
                orders:metaData,
                user_id:req.session.user.id,
                address: "123 Yishun Ave",
                postal_code: "123456",
            }
        };
        console.log('session',session);
    
        let shippingOptions = [];
        const shippingMethods = await shippingDataLayer.getAllShippingRates();
        for (let each of shippingMethods){
            const eachShippingRate = {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: {
                    amount: each.get('price'),
                    currency: 'SGD',
                  },
                  display_name: each.get('name'),
                  delivery_estimate: {
                    minimum: {
                      unit: 'business_day',
                      value: each.get('min_days'),
                    },
                    maximum: {
                      unit: 'business_day',
                      value: each.get('max_days'),
                    },
                  }
                }
              }
            shippingOptions.push(eachShippingRate);
        }
        console.log('shippingOptions',shippingOptions);
        session.shipping_options = shippingOptions;
    
        let stripeSesssion = await stripe.checkout.sessions.create(session);
    
        if(paymentErrors == false){
            res.render('checkout/checkout',{
                sessionId:stripeSesssion.id,
                publishableKey:process.env.STRIPE_PUBLISHABLE_KEY
            });
        } else{
            res.status(400);
            res.json({
                paymentErrors
            })
        }
    } catch(e) {
        res.status(500);
        res.json({
            message:"Internal Server Error"
        })
    }

});

router.get('/success',function(req,res){
    // res.send('payment success');
    req.flash('success_messages',"Order created - payment success");
    res.redirect('/order');
});

router.get('/cancel',function(req,res){
    req.flash('success_messages',"Order not created - payment cancelled");
    res.redirect('/cart');
});

router.post('/process_payment',express.raw({type:'application/json'}),async function(req,res){
    console.log('webhook success');
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event = null;
    try{
        event = stripe.webhooks.constructEvent(payload, sigHeader,endpointSecret);
        if(event.type == 'checkout.session.completed'){
            console.log('event.data.object',event.data.object);
            let paymentEvent = event.data.object;
            let shippingAddress = paymentEvent.metadata.address;
            let shippingPostalCode = paymentEvent.metadata.postal_code;
            let customerId = paymentEvent.client_reference_id;
            console.log('customer id',customerId);

            const orderCreatedDate= moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');
            const orderLastModifiedDate = orderCreatedDate;

            let shippingMethodPrice = paymentEvent.total_details.amount_shipping;
            let shippingMethod = await shippingDataLayer.getShippingMethodByPrice(shippingMethodPrice);
            let shippingMethodId = shippingMethod.get('id');

            let order = new Order();
            // order.set('id',orderId);
            order.set('shipping_address',shippingAddress);
            order.set('postal_code',shippingPostalCode);
            order.set('datetime_created',orderCreatedDate);
            order.set('datetime_last_modified',orderLastModifiedDate);
            order.set('shipping_method_id',shippingMethodId);
            order.set('order_status_id',1);
            order.set('customer_id',customerId);
            console.log('new order-----',order);
            await order.save();

            let newOrder = await Order.where({datetime_created:orderCreatedDate}).fetch({require:true});
            let newOrderId = newOrder.id;
            console.log('model.count',newOrderId);


            const metadata = JSON.parse(event.data.object.metadata.orders);
            console.log('metadata',metadata);
            
            metadata.map(async (each)=>{
                let orderedItems = new OrderItem();
                orderedItems.set('quantity',each.quantity);
                // orderedItems.set('cart_item_id',each.cart_item_id);
                // orderedItems.set('cart_item_id',41);
                orderedItems.set('tea_id',each.tea_id);
                orderedItems.set('order_id',newOrderId);
                console.log('orderedItems_',orderedItems);
                await orderedItems.save();

                await teaServiceLayer.updateTeaQuantity(each.tea_id,each.quantity);
            })

            let customerCart = await cartServiceLayer.getCartByUserId(customerId);
            customerCart.map(async (each)=>{
                await each.destroy();
            })

            res.send({
                'success':true
            })
        }
    } catch (e){
        console.log('payment error',e);
        res.sendStatus(500);
    }
})


module.exports = router;