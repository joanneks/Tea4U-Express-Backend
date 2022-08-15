const express =require('express');
const router = express.Router();
const {createPlaceOfOriginForm, editPlaceOfOriginForm , bootstrapField} = require('../forms');
const dataLayer = require('../dal/place-of-origin');
const {PlaceOfOrigin} = require('../models');

router.get('/',async function (req,res){
    const placeOfOrigins = await dataLayer.getAllPlaceOfOrigins();
    const placeOfOriginForm  = createPlaceOfOriginForm();
    res.render('dashboard/place-of-origin/index',{
        'form': placeOfOriginForm.toHTML(bootstrapField),
        'placeOfOrigins': placeOfOrigins.toJSON()
    });
});

router.post('/',async function (req,res){
    const placeOfOrigins = await dataLayer.getAllPlaceOfOrigins();
    const placeOfOriginForm  = createPlaceOfOriginForm();
    placeOfOriginForm.handle(req,{
        'success':async function (placeOfOriginForm){
            const placeOfOrigin = new PlaceOfOrigin();
            placeOfOrigin.set('name',placeOfOriginForm.data.name);
            await placeOfOrigin.save();
            res.redirect('/place-of-origin');
        },
        'error':async function (placeOfOriginForm){
            res.render('dashboard/place-of-origin/index',{
                'form': placeOfOriginForm.toHTML(bootstrapField),
                'placeOfOrigins': placeOfOrigins.toJSON()
            });
        },
        'empty':async function (placeOfOriginForm){
            res.render('dashboard/place-of-origin/index',{
                'form': placeOfOriginForm.toHTML(bootstrapField),
                'placeOfOrigins': placeOfOrigins.toJSON()
            });
        },
    })
});

router.get('/edit/:place_of_origin_id',async function (req,res){
    const placeOfOrigins = await dataLayer.getAllPlaceOfOrigins();
    const placeOfOriginForm  = createPlaceOfOriginForm();
    const placeOfOrigin = await dataLayer.getPlaceOfOriginById(req.params.place_of_origin_id);
    console.log(placeOfOrigin.toJSON());
    placeOfOriginForm.fields.name.value = placeOfOrigin.get('name');

    placeOfOriginForm.handle(req,{
        'success':async function(placeOfOriginForm){
            res.render('dashboard/place-of-origin/edit',{
                'form': placeOfOriginForm.toHTML(bootstrapField),
                'placeOfOrigins':placeOfOrigins.toJSON(),
                'placeOfOrigin':placeOfOrigin.toJSON()
            });
        },
        'error':async function(placeOfOriginForm){
            res.render('dashboard/place-of-origin/edit',{
                'form': placeOfOriginForm.toHTML(bootstrapField),
                'placeOfOrigins':placeOfOrigins.toJSON(),
                'placeOfOrigin':placeOfOrigin.toJSON()
            });
        },
        'empty':async function(placeOfOriginForm){
            res.render('dashboard/place-of-origin/edit',{
                'form': placeOfOriginForm.toHTML(bootstrapField),
                'placeOfOrigins':placeOfOrigins.toJSON(),
                'placeOfOrigin':placeOfOrigin.toJSON()
            });
        },
    })
})

router.post('/edit/:place_of_origin_id',async function (req,res){
    const placeOfOriginForm  = editPlaceOfOriginForm();
    const placeOfOrigins = await dataLayer.getAllPlaceOfOrigins();
    const placeOfOrigin = await dataLayer.getPlaceOfOriginById(req.params.place_of_origin_id);
    placeOfOriginForm.handle(req,{
        'success':async function(placeOfOriginForm){
            placeOfOrigin.set(placeOfOriginForm.data);
            placeOfOrigin.save();
            res.redirect('/place-of-origin')
        },
        'error':async function(placeOfOriginForm){
            res.render('dashboard/place-of-origin/edit',{
                'form': placeOfOriginForm.toHTML(bootstrapField),
                'placeOfOrigins':placeOfOrigins.toJSON(),
                'placeOfOrigin':placeOfOrigin.toJSON()
            });
        },
        'empty':async function(brandForm){
            res.render('dashboard/place-of-origin/edit',{
                'form': placeOfOriginForm.toHTML(bootstrapField),
                'placeOfOrigins':placeOfOrigins.toJSON(),
                'placeOfOrigin':placeOfOrigin.toJSON()
            });
        },
    })
})

router.get('/delete/:place_of_origin_id', async function (req,res){
    const placeOfOrigin = await dataLayer.getPlaceOfOriginById(req.params.place_of_origin_id);
    placeOfOrigin.destroy();
    res.redirect('/place-of-origin');
})

module.exports = router;