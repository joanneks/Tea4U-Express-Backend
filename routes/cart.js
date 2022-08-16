const express = require('express');
const router = express.Router();
const cartServiceLayer = require('../services/cart');


router.get('/',async function(req,res){
    const cartByUserId = await cartServiceLayer.getCartByUserId(req.session.user.id);
    console.log(cartByUserId.toJSON());
    let totalCost = 0;
    cartByUserId.toJSON().map(each=>{
        const costPerTeaId = each.quantity * (each.tea.cost/100);
        totalCost += costPerTeaId;
    });
    
    res.render('cart/index',{
        cartItems: cartByUserId.toJSON(),
        totalCost: totalCost
    })
})

router.get('/add/:tea_id', async function (req,res){
    const userId = req.session.user.id;
    const teaId = req.params.tea_id;
    await cartServiceLayer.addOneCartItem(userId,teaId,1);
    res.redirect('/cart');
})

router.get('/minus/:tea_id', async function (req,res){
    const userId = req.session.user.id;
    const teaId = req.params.tea_id;
    await cartServiceLayer.minusOneCartItem(userId,teaId);
    res.redirect('/cart');
})

router.get('/update-quantity/:tea_id', async function (req,res){
    const userId = req.session.user.id;
    const teaId = req.params.tea_id;
    const newQuantity = req.body.quantity;
    console.log(newQuantity);
    await cartServiceLayer.updateCartItemQuantity(userId,teaId,newQuantity);
    res.redirect('/cart');
})

router.post('/update-quantity/:tea_id', async function (req,res){
    const userId = req.session.user.id;
    const teaId = req.params.tea_id;
    const newQuantity = req.body.quantity;
    await cartServiceLayer.updateCartItemQuantity(userId,teaId,newQuantity);
    res.redirect('/cart');
})

router.get('/remove/:tea_id', async function(req,res){
    const userId = req.session.user.id;
    const teaId = req.params.tea_id;
    await cartServiceLayer.removeCartItem(userId,teaId);
    res.redirect('/cart');
})

module.exports = router;