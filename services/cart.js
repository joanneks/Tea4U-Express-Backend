const cartDataLayer = require('../dal/cart');
const teaDataLayer = require('../dal/tea');

async function getCartByUserId (userId) {
    const cart = cartDataLayer.getCartByUserId(userId);
    return cart;
};

async function addOneCartItem(userId,teaId,quantity){
    const tea = await teaDataLayer.getTeaById(teaId);
    const teaQuantity = tea.get('quantity');
    console.log('teaQuantity',teaQuantity);

    if(teaQuantity >= 1){
        const itemAdded = await cartDataLayer.addOneCartItem(userId,teaId,quantity);
        return itemAdded;
    } else if(teaQuantity == 0){
        return teaQuantity
    } else{
        return false;
    }
};

async function minusOneCartItem(userId,teaId){
    const cartItem = await cartDataLayer.getCartItemByUserAndTeaId(userId,teaId);
    const quantity = cartItem.get('quantity');
    if ( quantity == 1){
        console.log('removed cartItem - quantity',quantity);
        const cartItemRemoved =  await cartDataLayer.removeCartItem(userId,teaId);
        return cartItemRemoved;
    } else if( quantity > 1){
        console.log('reduced cartItem - quantity',quantity);
        const cartItemReduced = await cartDataLayer.minusOneCartItem(userId,teaId);
        return cartItemReduced;
    } else{
        console.log('hello');
        return false;
    }
};

async function updateCartItemQuantity(userId,teaId,newQuantity){
    const tea = await teaDataLayer.getTeaById(teaId);
    const teaQuantity = tea.get('quantity');
        if(teaQuantity >= newQuantity && newQuantity >= 0){
            return cartDataLayer.updateCartItemQuantity(userId,teaId,newQuantity);
        } else {
            return false;
        }
};

async function removeCartItem(userId,teaId){
    return cartDataLayer.removeCartItem(userId,teaId)
}



module.exports = {
    getCartByUserId, 
    addOneCartItem, minusOneCartItem, 
    updateCartItemQuantity, removeCartItem
};