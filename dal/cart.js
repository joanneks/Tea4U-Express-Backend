const { CartItem } = require('../models');

async function getCartByUserId (userId) {
    const cart = await CartItem.collection().where({
        user_id:userId
    }).fetch({
        require:false,
        withRelated:['tea']
    });
    return cart;
};

async function getCartItemByUserAndTeaId (userId,teaId){
    const cartItem = await CartItem.where({
        user_id:userId,
        tea_id:teaId
    }).fetch({
        require:false
    });
    return cartItem;
};

 async function addOneCartItem (userId,teaId,quantity){
    const cartItem = new CartItem({
        user_id:userId,
        tea_id:teaId,
        quantity:quantity
    });
    await cartItem.save();
    return cartItem;
 };

async function removeCartItem(userId,teaId){
    const cartItem = await getCartItemByUserAndTeaId(userId,teaId);
    await cartItem.destroy();
};

 async function minusOneCartItem(userId,teaId){
    const cartItem = await getCartItemByUserAndTeaId(userId,teaId);
    const quantity = cartItem.get('quantity');
    if ( quantity == 1){
        console.log('removed cart - quantity',quantity);
        removeCartItem(userId,teaId);
    } else{
        console.log('quantity',quantity);
        const newQuantity = quantity - 1;
        console.log('New quantity',newQuantity);
        cartItem.set('quantity',newQuantity);
        await cartItem.save();
    };
 };

 async function updateCartItemQuantity (userId,teaId,newQuantity){
    const cartItem = await getCartItemByUserAndTeaId(userId,teaId);
    if(cartItem){
        if(newQuantity==0){
            removeCartItem(userId,teaId);
        } else {
            cartItem.set('quantity',newQuantity);
            await cartItem.save();
        };
    };
 };



module.exports = {
    getCartByUserId, getCartItemByUserAndTeaId, 
    addOneCartItem, removeCartItem, minusOneCartItem,
    updateCartItemQuantity 
};