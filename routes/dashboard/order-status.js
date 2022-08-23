const express =require('express');
const router = express.Router();
const {createOrderStatusForm, bootstrapField} = require('../../forms');
const dataLayer = require('../../dal/order-status');
const {OrderStatus} = require('../../models');
const {checkIfAuthenticated} = require('../../middlewares');

router.get('/', checkIfAuthenticated,async function (req,res){
    const orderStatuses = await dataLayer.getAllOrderStatuses();
    const orderStatusForm  = createOrderStatusForm();
    res.render('dashboard/order-status/index',{
        'form': orderStatusForm.toHTML(bootstrapField),
        'orderStatuses': orderStatuses.toJSON()
    });
});

router.post('/', checkIfAuthenticated,async function (req,res){
    const orderStatuses = await dataLayer.getAllOrderStatuses();
    const orderStatusForm  = createOrderStatusForm("Name");
    orderStatusForm.handle(req,{
        'success':async function (orderStatusForm){
            const orderStatus = new OrderStatus();
            orderStatus.set('name',orderStatusForm.data.name);
            await orderStatus.save();
            req.flash('success_messages',"New Order Status created successfully");
            res.redirect('/order-status');
        },
        'error':async function (orderStatusForm){
            res.render('dashboard/order-status/index',{
                'form': orderStatusForm.toHTML(bootstrapField),
                'orderStatuses': orderStatuses.toJSON()
            });
        },
        'empty':async function (orderStatusForm){
            res.render('dashboard/order-status/index',{
                'form': orderStatusForm.toHTML(bootstrapField),
                'orderStatuses': orderStatuses.toJSON()
            });
        },
    })
});

router.get('/edit/:order_status_id', checkIfAuthenticated,async function (req,res){
    const orderStatusForm  = createOrderStatusForm("Update Order Status Name");
    const orderStatuses = await dataLayer.getAllOrderStatuses();
    const orderStatus = await dataLayer.getOrderStatusById(req.params.order_status_id);
    orderStatusForm.fields.name.value = orderStatus.get('name');

    orderStatusForm.handle(req,{
        'success':async function(orderStatusForm){
            res.render('dashboard/order-status/edit',{
                'form': orderStatusForm.toHTML(bootstrapField),
                'orderStatuses':orderStatuses.toJSON(),
                'orderStatus':orderStatus.toJSON()
            });
        },
        'error':async function(orderStatusForm){
            res.render('dashboard/order-status/edit',{
                'form': orderStatusForm.toHTML(bootstrapField),
                'orderStatuses':orderStatuses.toJSON(),
                'orderStatus':orderStatus.toJSON()
            });
        },
        'empty':async function(orderStatusForm){
            res.render('dashboard/order-status/edit',{
                'form': orderStatusForm.toHTML(bootstrapField),
                'orderStatuses':orderStatuses.toJSON(),
                'orderStatus':orderStatus.toJSON()
            });
        },
    })
})

router.post('/edit/:order_status_id', checkIfAuthenticated,async function (req,res){
    const orderStatusForm  = createOrderStatusForm("Update Order Status Name");
    const orderStatuses = await dataLayer.getAllOrderStatuses();
    const orderStatus = await dataLayer.getOrderStatusById(req.params.order_status_id);
    orderStatusForm.handle(req,{
        'success':async function(orderStatusForm){
            orderStatus.set(orderStatusForm.data);
            orderStatus.save();
            req.flash('success_messages',"Order Status updated successfully");
            res.redirect('/order-status')
        },
        'error':async function(orderStatusForm){
            res.render('dashboard/order-status/edit',{
                'form': orderStatusForm.toHTML(bootstrapField),
                'orderStatuses':orderStatuses.toJSON(),
                'orderStatus':orderStatus.toJSON()
            });
        },
        'empty':async function(orderStatusForm){
            res.render('dashboard/order-status/edit',{
                'form': orderStatusForm.toHTML(bootstrapField),
                'orderStatuses':orderStatuses.toJSON(),
                'orderStatus':orderStatus.toJSON()
            });
        },
    })
})

router.get('/delete/:order_status_id', checkIfAuthenticated, async function (req,res){
    const orderStatus = await dataLayer.getOrderStatusById(req.params.order_status_id);
    orderStatus.destroy();
    req.flash('success_messages',"Order Status has been deleted");
    res.redirect('/order-status');
})

module.exports = router;