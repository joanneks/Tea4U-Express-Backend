const { CartItem } = require('../models');

async function getCartByUserId (userId) {
    const cart = await CartItem.collection().where({
        customer_id:userId
    }).fetch({
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
        await newCartItem.save();
        console.log('newCartItem',newCartItem.toJSON());
        return newCartItem;
    } else {
        const formerQuantity = cartItem.get('quantity');
        const newQuantity = formerQuantity + 1;
        cartItem.set('quantity',newQuantity);
        await cartItem.save();
        console.log('formerQuantity',formerQuantity,'newQuantity'.newQuantity);
        console.log('add to existing cart item',cartItem.toJSON());
        return cartItem;
    }
 };

async function removeCartItem(userId,teaId){
    const cartItem = await getCartItemByUserAndTeaId(userId,teaId);
    await cartItem.destroy();
    return cartItem;
};

 async function minusOneCartItem(userId,teaId){
    console.log('hello000000');
    const cartItem = await getCartItemByUserAndTeaId(userId,teaId);
    console.log(cartItem);
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
        }
    };
 };



module.exports = {
    getCartByUserId, getCartItemByUserAndTeaId, 
    addOneCartItem, removeCartItem, minusOneCartItem,
    updateCartItemQuantity 
};