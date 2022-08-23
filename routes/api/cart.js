const express = require('express');
const router = express.Router();
const cartServiceLayer = require('../../services/cart');
const {checkIfAuthenticatedJWT} = require('../../middlewares');


router.post('/', checkIfAuthenticatedJWT, async function(req,res){
    try{
        const userId = req.body.user_id;
        if(userId==req.session.customer.id){
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
        // need to send back access token as well. tested with arc
        const userId = req.body.user_id;
        const teaId = req.params.tea_id;

        if(userId==req.session.customer.id){
            // itemAdded refers to the updated CartItem data saved
            const itemAdded = await cartServiceLayer.addOneCartItem(userId,teaId,1);
            console.log('itemAdded - return 0 or object',itemAdded);
    
            let formerQuantity = itemAdded.get('quantity')-1;
            console.log('former quantity',formerQuantity);
            
            if(itemAdded == 0){
                res.status(200);
                res.json({
                    itemAdded:'',
                    message:"Tea Product is out of stock"
                })
                console.log('No stock to add to cart',itemAdded);
            } else{
                res.status(200)
                res.json({
                    itemAdded:itemAdded,
                    message:'Tea Product quantity in cart added by 1 successfully'
                });
                console.log('added success');
                console.log('itemAdded successfully',itemAdded.toJSON());
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
        const teaId = req.params.tea_id;

        if(userId==req.session.customer.id){
            // itemReduced refers to the updated CartItem data saved
            const itemReduced = await cartServiceLayer.minusOneCartItem(userId,teaId);
            console.log('-----itemREduced---',itemReduced);
            let formerQuantity = itemReduced.get('quantity')+1;
            if(isNaN(formerQuantity) == true){
                formerQuantity = 1;
            }
            console.log('former quantity',formerQuantity);

            if ( formerQuantity == 1){
                res.status(200)
                res.json({
                    message:'Tea Product removed from cart (qty: 1 to 0) successfully'
                });
                console.log('itemReduced - quantity 1 to 0',itemReduced.toJSON());
            } else if ( formerQuantity > 1){
                res.status(200)
                res.json({
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