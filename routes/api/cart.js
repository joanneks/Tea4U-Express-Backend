const express = require('express');
const router = express.Router();
const cartDataLayer = require('../../dal/cart');
const cartServiceLayer = require('../../services/cart');
const {checkIfAuthenticatedJWT} = require('../../middlewares');
const { dataType } = require('db-migrate');


router.post('/', checkIfAuthenticatedJWT, async function(req,res){
    try{
        const userId = req.body.user_id;
        console.log('userId',userId);
        console.log('true or false',userId==req.customer.id);
        if(userId==req.customer.id){
            // need to send back access token as well. tested with arc
            const cartByUserId = await cartServiceLayer.getCartByUserId(userId);
            console.log(cartByUserId.toJSON());
            let totalCost = 0;
            cartByUserId.toJSON().map(each=>{
                const costPerTeaId = each.quantity * (each.tea.cost/100);
                totalCost += costPerTeaId;
            });
            res.status(200);
            res.json({
                cartItems: cartByUserId.toJSON(),
                totalCost: totalCost,
                message: "Display all tea products in cart success"
            });
        }else{
            res.status(401);
            res.json({
                message:"Customer/User Id not jwt verified, request to display all tea products in cart failed"
            })
        }
    }catch(e){
        res.status(400);
        res.json({
            message:"Response received invalid, request to add tea product quantity in cart failed"
        })
    }
    
})

router.post('/add/:tea_id', checkIfAuthenticatedJWT, async function (req,res){
    try{
        const userId = req.body.user_id;
        const teaId = req.body.tea_id;
        console.log('userid',userId);
        console.log('userid',req.customer.id);
        console.log('true or false',userId==req.customer.id);

        if(userId==req.customer.id){
            // itemAdded refers to the updated CartItem data saved
            const itemAdded = await cartServiceLayer.addOneCartItem(userId,teaId,1);
            console.log('itemAdded - return 0 or object',itemAdded);
            const cartItems = await cartDataLayer.getCartByUserId(userId);
            console.log(itemAdded == 0)
            if(itemAdded == 0){
                console.log('0000000')
                res.status(200);
                res.json({
                    itemAdded:'',
                    message:"Tea Product is out of stock"
                })
                console.log('No stock to add to cart',itemAdded);
            } else{
                if(itemAdded == 1){
                    console.log('insufficient')
                    res.status(200)
                    res.json({
                        itemAdded:[],
                        cartItems:cartItems,
                        message:'Insufficient stock for desired purchase quantity'
                    });
                } else
                if(itemAdded || itemAdded == null){
                    console.log('add')
                    res.status(200)
                    res.json({
                        itemAdded:itemAdded,
                        cartItems:cartItems,
                        message:'Tea Product quantity in cart added by 1 successfully'
                    });
                    console.log('added success');
                    console.log('itemAdded successfully',itemAdded.toJSON());    
                }
                // else{
                //     console.log('insufficient')
                //     res.status(200)
                //     res.json({
                //         itemAdded:'',
                //         message:'Insufficient stock for desired purchase quantity'
                //     });
                // }
            }
        } else{
            res.status(401);
            res.json({
                message:"Customer/User Id not jwt verified, request to add tea product quantity in cart failed"
            })
        }

    }catch(e){
        res.status(400);
        res.json({
            message:"Response received invalid, request to add tea product quantity in cart failed"
        })
    }
})

router.post('/minus/:tea_id', checkIfAuthenticatedJWT, async function (req,res){
    try {
        // need to send back access token as well. tested with arc
        const userId = req.body.user_id;
        const teaId = req.body.tea_id;
        console.log(userId,teaId)
        console.log('true or false',userId==req.customer.id)
            
        if(userId==req.customer.id){
            // itemReduced refers to the updated CartItem data saved
            const itemReduced = await cartServiceLayer.minusOneCartItem(userId,teaId);
            console.log('-----itemREduced---',itemReduced);
            let formerQuantity = itemReduced.get('quantity')+1;
            if(isNaN(formerQuantity) == true){
                formerQuantity = 1;
            }
            console.log('former quantity',formerQuantity);
            const cartItems = await cartDataLayer.getCartByUserId(userId);

            if ( formerQuantity == 1){
                res.status(200)
                res.json({
                    cartItems,
                    message:'Tea Product removed from cart (qty: 1 to 0) successfully'
                });
                console.log('itemReduced - quantity 1 to 0',itemReduced.toJSON());
            } else if ( formerQuantity > 1){
                res.status(200)
                res.json({
                    cartItems,
                    itemReduced,
                    message:'Tea Product quantity in cart reduced by 1 successfully'
                });
                console.log('itemReduced - quantity minus 1',itemReduced.toJSON());
            } 
            // else if ( formerQuantity < 1){
            //     console.log('asdasdasd');
            //     res.status(200)
            //     res.json({
            //         message:'Tea Product does not exist in cart. Request to reduce quantity rejected.'
            //     });
            // }
        } else{
            res.status(401);
            res.json({
                message:"Customer/User Id not jwt verified, request to reduce tea product quantity in cart failed"
            })
        }
    }catch(e){
        res.status(400);
        res.json({
            message:"Response received invalid, request to reduce tea product quantity in cart failed"
        })
    }
})

router.post('/update-quantity/:tea_id',  checkIfAuthenticatedJWT, async function (req,res){
    try{
        // need to send back access token as well. tested with arc
        const userId = req.body.user_id;
        const teaId = req.params.tea_id;
        const newQuantity = req.body.quantity;

        if(userId==req.session.customer.id){
            let message = "";
            // cartItemQuantityAmended refers to the updated CartItem data saved
            const cartItemQuantityAmended = await cartServiceLayer.updateCartItemQuantity(userId,teaId,newQuantity);
            console.log(cartItemQuantityAmended);

            if(cartItemQuantityAmended == false){
                console.log('cartItemQuantityAmended == false');
                res.status(200);
                res.json({
                    message:"Quantity set must be a positive number"
                })
            } 
            else if(cartItemQuantityAmended == 2){
                res.status(200);
                res.json({
                    message:"Quantity set to 0. Tea Product removed from cart successfully"
                })
            } 
            else if(cartItemQuantityAmended == 1){
                console.log('cartItemQuantityAmended == 1');
                    res.status(200);
                    res.json({
                        message: "Insufficient stock - quantity set is more than stock availability"
                    })
                // }
            }else if (cartItemQuantityAmended){
                console.log('cartItemQuantityAmende == ');
                console.log(cartItemQuantityAmended.get('quantity'));
                message = "Tea Product quantity in cart updated to " + cartItemQuantityAmended.get('quantity') + " successfully";
                console.log(message);
                res.status(200);
                res.json({
                    cartItemQuantityAmended,
                    message
                });
            }
        } else{
            res.status(401);
            res.json({
                message:"Customer/User Id not jwt verified, request to reduce tea product quantity in cart failed"
            })
        }
    }catch(e){
        res.status(400);
        res.json({
            message:"Response received invalid, request to reduce tea product quantity in cart failed"
        })
    }
})

router.post('/remove/:tea_id', checkIfAuthenticatedJWT, async function(req,res){
    try{
        // need to send back access token as well. tested with arc
        const userId = req.body.user_id;
        const teaId = req.params.tea_id;
        // itemRemoved refers to the CartItem data that was removed
        const itemRemoved = await cartServiceLayer.removeCartItem(userId,teaId);
        
        if(userId==req.session.customer.id){
            if(itemRemoved == false){
                console.log(itemRemoved);
                res.status(200)
                res.json({
                    itemAdded:'',
                    message:'Tea Product does not exist in cart. Request to remove cart item failed.'
                });
            } else {
                console.log(itemRemoved.toJSON());
                res.status(200)
                res.json({
                    itemAdded:'itemRemoved',
                    message:'Tea Product removed from cart successfully'
                });
            }
        } else{
            res.status(401);
            res.json({
                message:"Customer/User Id not jwt verified, request to reduce tea product quantity in cart failed"
            })
        }
    }catch(e){
        res.status(400);
        res.json({
            message:"Response received invalid, request to add tea product quantity in cart failed"
        })
    }
})

module.exports = router;