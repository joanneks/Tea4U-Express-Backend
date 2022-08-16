const cartDataLayer = require('../dal/cart');

async function getCartByUserId (userId) {
    const cart = cartDataLayer.getCartByUserId(userId);
    return cart;
};

async function addOneCartItem(userId,teaId,quantity){
    const cartItem = await cartDataLayer.getCartItemByUserAndTeaId(userId,teaId);
    if(!cartItem){
        await cartDataLayer.addOneCartItem(userId,teaId,quantity);
    } else {
        const newQuantity = cartItem.get('quantity')+1;
        cartItem.set('quantity',newQuantity);
        await cartItem.save();
    };
};

async function minusOneCartItem(userId,teaId){
    return cartDataLayer.minusOneCartItem(userId,teaId);
};

async function updateCartItemQuantity(userId,teaId,newQuantity){
    return cartDataLayer.updateCartItemQuantity(userId,teaId,newQuantity);
};

async function removeCartItem(userId,teaId){
    return cartDataLayer.removeCartItem(userId,teaId)
}



module.exports = {
    getCartByUserId, 
    addOneCartItem, minusOneCartItem, 
    updateCartItemQuantity, removeCartItem
};