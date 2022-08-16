const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    apiVersion:"2020-08-27"
});
const cartServiceLayer = require('../services/cart');
const {checkIfAuthenticated} = require('../middlewares');

router.get('/', checkIfAuthenticated,async function (req,res){
    const items = await cartServiceLayer.getCartByUserId(req.session.user.id);
    let lineItems = [];
    let meta = [];
    for(let item of items){
        const eachLineItem={
            name:item.related('tea').get('name'),
            // brand:item.related('brand').get('brand'),
            amount:item.related('tea').get('cost'),
            quantity:item.get('quantity'),
            currency:'SGD'
        };
        if(item.related('tea').get('image_url')){
            eachLineItem.images = [item.related('tea').get('image_url')]
        };

        lineItems.push(eachLineItem);
        meta.push({
            tea_id:item.get('tea_id'),
            quantity:item.get('quantity')
        });
    };

    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types:['card'],
        line_items:lineItems,
        success_url:process.env.STRIPE_SUCCESS_URL+"?sessionId={CHECKOUT_SESSION_ID}",
        cancel_url:process.env.STRIPE_CANCEL_URL,
        metadata:{
            orders:metaData,
            user_id:req.session.user.id
        }
    };

    let stripeSesssion = await stripe.checkout.sessions.create(payment);

    res.render('checkout/checkout',{
        sessionId:stripeSesssion.id,
        publishableKey:process.env.STRIPE_PUBLISHABLE_KEY
    });

});

router.get('/success',function(req,res){
    res.send('payment success');
});

router.get('/cancel',function(req,res){
    res.send('payment cancelled');
});

router.post('/process_payment',express.raw({type:'application/json'}),async function(req,res){
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event = null;
    try{
        event = stripe.webhooks.constructEvent(payload, sigHeader,endpointSecret);
        if(event.type == 'checkout.session.completed'){
            console.log('event.data.object',event.data.object);
            const metadata = JSON.parse(event.data.object.metadata.orders);
            console.log('metadata',metadata);
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