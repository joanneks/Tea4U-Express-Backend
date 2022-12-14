const { CartItem } = require('../models');

async function getCartByUserId (userId) {
    const cart = await CartItem.collection().where({
        customer_id:userId
    }).orderBy('tea_id','asc').fetch({
        require:false,
        withRelated:['tea']
    });
    return cart;
};

async function getCartItemByUserAndTeaId (userId,teaId){
    const cartItem = await CartItem.where({
        customer_id:userId,
        tea_id:teaId
    }).fetch({
        require:false
    });
    return cartItem;
};

 async function addOneCartItem (userId,teaId,quantity){
    const cartItem = await getCartItemByUserAndTeaId(userId,teaId);

    if(cartItem == null){
        const newCartItem = new CartItem({
            customer_id:userId,
            tea_id:teaId,
            quantity:quantity
        });
        console.log('QUANTITY,ITEM DOES NOT EXIST',quantity)
        await newCartItem.save();
        return newCartItem;
    } else {
        const formerQuantity = cartItem.get('quantity');
        const newQuantity = parseInt(formerQuantity) + parseInt(quantity);
        cartItem.set('quantity',newQuantity);
        console.log('QUANTITY,ITEM EXISTS',quantity)
        await cartItem.save();
        console.log('formerQuantity',formerQuantity,'newQuantity'.newQuantity);
        return cartItem;
    }
 };

async function removeCartItem(userId,teaId){
    const cartItem = await getCartItemByUserAndTeaId(userId,teaId);
    await cartItem.destroy();
    return cartItem;
};

 async function minusOneCartItem(userId,teaId){
    const cartItem = await getCartItemByUserAndTeaId(userId,teaId);

    const quantity = cartItem.get('quantity');
    const newQuantity = quantity - 1;
    console.log('quantity',quantity,'New quantity',newQuantity);

    cartItem.set('quantity',newQuantity);
    await cartItem.save();
    return cartItem;
 };

 async function updateCartItemQuantity (userId,teaId,newQuantity){
    const cartItem = await getCartItemByUserAndTeaId(userId,teaId);
    if(cartItem){
        if(newQuantity == 0){
            removeCartItem(userId,teaId);
        } else if (newQuantity > 0){
            cartItem.set('quantity',newQuantity);
            await cartItem.save();
            return cartItem;
        }
    }else{
        
    };
 };

module.exports = {
    getCartByUserId, getCartItemByUserAndTeaId, 
    addOneCartItem, removeCartItem, minusOneCartItem,
    updateCartItemQuantity 
};