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
        return false;
    }
};

async function updateCartItemQuantity(userId,teaId,newQuantity){
    const tea = await teaDataLayer.getTeaById(teaId);
    const teaQuantity = tea.get('quantity');
    console.log('tea Quantity',teaQuantity);
    if (newQuantity<0){
        console.log('newQuantity<0');
        return false;
    } 
    else if(newQuantity == 0){
        return 2;
    } 
    else if (newQuantity>=0){
        if(teaQuantity >= newQuantity){
            console.log("newQuantity >= 0, teaQuantity >= newQuantity")
            return cartDataLayer.updateCartItemQuantity(userId,teaId,newQuantity);
        } else if (teaQuantity < newQuantity){
            console.log("newQuantity >= 0, teaQuantity < newQuantity")
            return 1
        }
    }
};

async function removeCartItem(userId,teaId){
    const cartItem = await cartDataLayer.getCartItemByUserAndTeaId(userId,teaId);
    if(cartItem){
        console.log('cartItem removed',cartItem.toJSON());
        return cartDataLayer.removeCartItem(userId,teaId)
    } else {
        console.log('cartItem removed',cartItem);
        return false
    }
}



module.exports = {
    getCartByUserId, 
    addOneCartItem, minusOneCartItem, 
    updateCartItemQuantity, removeCartItem
};