const cartDataLayer = require('../dal/cart');
const teaDataLayer = require('../dal/tea');

async function getCartByUserId (userId) {
    const cart = cartDataLayer.getCartByUserId(userId);
    return cart;
};

async function addOneCartItem(userId,teaId,quantity){
    const cartItem = await cartDataLayer.getCartItemByUserAndTeaId(userId,teaId);
    if(cartItem){
        const cartItemQuantity = cartItem.get('quantity');
        const tea = await teaDataLayer.getTeaById(teaId);
        const teaQuantity = tea.get('quantity');
        console.log('teaQuantity',teaQuantity);
        console.log('cartItemservicelayer',cartItem)
        if(cartItemQuantity < teaQuantity){
            if(teaQuantity >= 1 && cartItemQuantity < teaQuantity){
                const itemAdded = await cartDataLayer.addOneCartItem(userId,teaId,quantity);
                return itemAdded;
            } else if(teaQuantity == 0){
                return teaQuantity
            } else{
                return false;
            }
        }else{
            return 1;
        }
    } else{
        const itemAdded = await cartDataLayer.addOneCartItem(userId,teaId,quantity);
        return itemAdded;
    }
};

async function minusOneCartItem(userId,teaId){
    const cartItem = await cartDataLayer.getCartItemByUserAndTeaId(userId,teaId);
    console.log('cartItem status',cartItem)
    const quantity = cartItem.get('quantity');
    if ( quantity == 1){
        console.log('removed cartItem - quantity',quantity);
        const cartItemRemoved =  await cartDataLayer.removeCartItem(userId,teaId);
        return cartItemRemoved;
    } else if( quantity > 1){
        console.log('reduced cartItem - quantity',quantity);
        const cartItemReduced = await cartDataLayer.minusOneCartItem(userId,teaId);
        return cartItemReduced;
    } else if (quantity == null){
        console.log('return null, 1');
        return 1;
    } else {
        console.log('return false')
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