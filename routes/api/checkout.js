const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    apiVersion:"2020-08-27"
});
const {checkIfAuthenticatedJWT} = require('../../middlewares');
const cartServiceLayer = require('../../services/cart');
const teaDataLayer = require ('../../dal/tea');
const shippingDataLayer = require ('../../dal/shipping-method');
const {OrderItems, Order} = require('../../models');
const moment = require('moment');
const momentTimezone = require('moment-timezone');

router.post('/', checkIfAuthenticatedJWT,async function (req,res){
    try{
        let userId = req.body.user_id;
        let userEmail = req.body.user_email;
        let userShippingAddress =req.body.shipping_address;
        let userPostalCode = req.body.postal_code;
        console.log('USER DETAILS',userId,userEmail,userShippingAddress,userPostalCode);

        const items = await cartServiceLayer.getCartByUserId(userId);
        let lineItems = [];
        let meta = [];
        let paymentErrors= [];
        // console.log("ITEMS",items);
        for(let item of items){
            console.log("TESTING",item);
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
                cart_item_id:item.get('id'),
                quantity:item.get('quantity')
            });
        };
        
        let metaData = JSON.stringify(meta);
        let session = {
            payment_method_types:['card'],
            line_items:lineItems,
            success_url:process.env.STRIPE_SUCCESS_URL+"?sessionId={CHECKOUT_SESSION_ID}",
            cancel_url:process.env.STRIPE_CANCEL_URL,
            client_reference_id:userId,
            customer_email:userEmail,
            metadata:{
                orders:metaData,
                user_id:userId,
                address: userShippingAddress,
                postal_code: userPostalCode,
            }
        };
    
        let shippingOptions = [];
        const shippingMethods = await shippingDataLayer.getAllShippingMethods();
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
    res.send('payment success');
});

router.get('/cancel',function(req,res){
    res.send('payment cancelled');
});

router.post('/process_payment',express.raw({type:'application/json'}),async function(req,res){
    console.log('webhook success');
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event = null;
    // console.log('payloadd',payload,'endpointsecret',endpointSecret,'sigheader',sigHeader)
    try{
        event = stripe.webhooks.constructEvent(payload, sigHeader,endpointSecret);
        if(event.type == 'checkout.session.completed'){
            console.log('event.data.object',event.data.object);
            let paymentEvent = event.data.object;
            let shippingAddress = paymentEvent.metadata.address;
            let shippingPostalCode = paymentEvent.metadata.postal_code;
            let userId = paymentEvent.client_reference_id;
            console.log('user id',userId);

            const orderCreatedDate= moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');
            const orderLastModifiedDate = orderCreatedDate;

            let shippingMethodPrice = paymentEvent.total_details.amount_shipping;
            let shippingMethod = await shippingDataLayer.getShippingMethodByPrice(shippingMethodPrice);
            let shippingMethodId = shippingMethod.get('id');

            let order = new Order();
            order.set('shipping_address',shippingAddress);
            order.set('postal_code',shippingPostalCode);
            order.set('datetime_created',orderCreatedDate);
            order.set('datetime_last_modified',orderLastModifiedDate);
            order.set('shipping_method_id',shippingMethodId);
            order.set('order_status_id',1);
            order.set('customer_id',userId);
            console.log('new order-----',order);
            await order.save();

            let newOrder = await Order.where({datetime_created:orderCreatedDate}).fetch({require:true});
            let newOrderId = newOrder.id;
            console.log('model.count',newOrderId);


            const metadata = JSON.parse(event.data.object.metadata.orders);
            console.log('metadata',metadata);
            
            metadata.map(async (each)=>{
                let orderedItems = new OrderItems();
                orderedItems.set('quantity',each.quantity);
                orderedItems.set('cart_item_id',each.cart_item_id);
                orderedItems.set('tea_id',each.tea_id);
                orderedItems.set('order_id',newOrderId);
                console.log('orderedItems_',orderedItems);
                await orderedItems.save();
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