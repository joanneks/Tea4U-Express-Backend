const express =require('express');
const router = express.Router();
const {createShippingMethodForm, bootstrapField} = require('../../forms');
const dataLayer = require('../../dal/shipping-method');
const {ShippingMethod} = require('../../models');
const {checkIfAuthenticated} = require('../../middlewares');

router.get('/', checkIfAuthenticated,async function (req,res){
    const shippingMethods = await dataLayer.getAllShippingRates();
    const shippingMethodForm  = createShippingMethodForm();
    res.render('dashboard/shipping-method/index',{
        'form': shippingMethodForm.toHTML(bootstrapField),
        'shippingMethods': shippingMethods.toJSON()
    });
});

router.post('/', checkIfAuthenticated,async function (req,res){
    const shippingMethods = await dataLayer.getAllShippingRates();
    const shippingMethodForm  = createShippingMethodForm("Shipping Method Name");
    shippingMethodForm.handle(req,{
        'success':async function (shippingMethodForm){
            const shippingMethod = new ShippingMethod();
            let {price,...shippingMethodData} = shippingMethodForm.data;
            shippingMethod.set('price',shippingMethodForm.data.price * 100);
            console.log('shipping',shippingMethodForm.data)
            console.log('shipping',shippingMethodData)
            shippingMethod.set(shippingMethodData);
            await shippingMethod.save();
            req.flash('success_messages',"New Shipping Method created successfully");
            res.redirect('/shipping-method');
        },
        'error':async function (shippingMethodForm){
            res.render('dashboard/shipping-method/index',{
                'form': shippingMethodForm.toHTML(bootstrapField),
                'shippingMethods': shippingMethods.toJSON()
            });
        },
        'empty':async function (shippingMethodForm){
            res.render('dashboard/shipping-method/index',{
                'form': shippingMethodMethodForm.toHTML(bootstrapField),
                'shippingMethods': shippingMethods.toJSON()
            });
        },
    })
});

router.get('/edit/:shipping_method_id', checkIfAuthenticated,async function (req,res){
    const shippingMethodForm  = createShippingMethodForm("Update Shipping Method Name");
    const shippingMethods = await dataLayer.getAllShippingRates();
    const shippingMethod = await dataLayer.getShippingMethodById(req.params.shipping_method_id);
    shippingMethodForm.fields.name.value = shippingMethod.get('name');
    shippingMethodForm.fields.price.value = shippingMethod.get('price');
    shippingMethodForm.fields.min_days.value = shippingMethod.get('min_days');
    shippingMethodForm.fields.max_days.value = shippingMethod.get('max_days');

    shippingMethodForm.handle(req,{
        'success':async function(shippingMethodForm){
            res.render('dashboard/shipping-method/edit',{
                'form': shippingMethodForm.toHTML(bootstrapField),
                'shippingMethods':shippingMethods.toJSON(),
                'shippingMethod':shippingMethod.toJSON()
            });
        },
        'error':async function(shippingMethodForm){
            res.render('dashboard/shipping-method/edit',{
                'form': shippingMethodForm.toHTML(bootstrapField),
                'shippingMethods':shippingMethods.toJSON(),
                'shippingMethod':shippingMethod.toJSON()
            });
        },
        'empty':async function(shippingMethodForm){
            res.render('dashboard/shipping-method/edit',{
                'form': shippingMethodForm.toHTML(bootstrapField),
                'shippingMethods':shippingMethods.toJSON(),
                'shippingMethod':shippingMethod.toJSON()
            });
        },
    })
})

router.post('/edit/:shipping_method_id', checkIfAuthenticated,async function (req,res){
    const shippingMethodForm  = createShippingMethodForm("Update Shipping Method Name");
    const shippingMethods = await dataLayer.getAllShippingRates();
    const shippingMethod = await dataLayer.getShippingMethodById(req.params.shipping_method_id);
    shippingMethodForm.handle(req,{
        'success':async function(shippingMethodForm){
            let {price,shippingMethodData} = shippingMethodForm.data;
            shippingMethod.set('price',shippingMethodForm.data.price * 100);
            shippingMethod.set(shippingMethodData);
            await shippingMethod.save();
            req.flash('success_messages',"Tea Shipping Method updated successfully");
            res.redirect('/shipping-method')
        },
        'error':async function(shippingMethodForm){
            res.render('dashboard/shipping-method/edit',{
                'form': shippingMethodForm.toHTML(bootstrapField),
                'shippingMethods':shippingMethods.toJSON(),
                'shippingMethod':shippingMethod.toJSON()
            });
        },
        'empty':async function(shippingMethodForm){
            res.render('dashboard/shipping-method/edit',{
                'form': shippingMethodForm.toHTML(bootstrapField),
                'shippingMethods':shippingMethods.toJSON(),
                'shippingMethod':shippingMethod.toJSON()
            });
        },
    })
})

router.get('/delete/:shipping_method_id', checkIfAuthenticated, async function (req,res){
    const shippingMethod = await dataLayer.getShippingMethodById(req.params.shipping_method_id);
    shippingMethod.destroy();
    req.flash('success_messages',"Tea Shipping Method has been deleted");
    res.redirect('/shipping-method');
})

module.exports = router;