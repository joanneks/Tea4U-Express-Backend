const express = require('express');
const { Tea } = require('../models');
const dataLayer = require('../dal/tea')
const router = express.Router();
const {bootstrapField, createTeaForm, editTeaForm } = require('../forms');
const moment = require('moment');
const momentTimezone = require('moment-timezone');

router.get('/',async function (req,res){
    const tea = await dataLayer.getAllTea();

    res.render('tea/index',{
        tea: tea.toJSON(),
    })
})

router.get('/create',async function (req,res){
    const teaTypes = await dataLayer.getAllTeaTypes();
    const brands = await dataLayer.getAllBrands();
    const packaging = await dataLayer.getAllPackaging();
    const placeOfOrigin = await dataLayer.getAllPlaceOfOrigin();
    const teaForm = createTeaForm(brands,teaTypes,packaging,placeOfOrigin);
    res.render('tea/create',{
        form: teaForm.toHTML(bootstrapField),
    })
})

router.post ('/create',async function (req,res){
    const teaTypes = await dataLayer.getAllTeaTypes();
    const brands = await dataLayer.getAllBrands();
    const packaging = await dataLayer.getAllPackaging();
    const placeOfOrigin = await dataLayer.getAllPlaceOfOrigin();
    const teaForm = createTeaForm(brands,teaTypes,packaging,placeOfOrigin);
    
    teaForm.handle(req,{
        'success':async function(teaForm){
            const tea = new Tea();
            let {cost,...teaData} = teaForm.data;

            const teaCreatedDate= moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');
            const teaLastModifiedDate = teaCreatedDate;

            tea.set('cost',teaForm.data.cost*100);
            // teaForm.data.datetime_created = teaCreatedDate;
            tea.set('datetime_created',teaCreatedDate);
            tea.set('datetime_last_modified',teaLastModifiedDate)
            tea.set(teaData);
            await tea.save();
            res.redirect('/tea');
        },
        'error':function(teaForm){
            res.render('tea/create',{
                form: teaForm.toHTML(bootstrapField)
            })
        },
        'empty': function (teaForm){
            res.render('tea/create',{
                form: teaForm.toHTML(bootstrapField)
            })
        }
    })  
})

router.get('/edit/:tea_id',async function(req,res){
    const tea = await dataLayer.getTeaById(req.params.tea_id);
    const teaTypes = await dataLayer.getAllTeaTypes();
    const brands = await dataLayer.getAllBrands();
    const packaging = await dataLayer.getAllPackaging();
    const placeOfOrigin = await dataLayer.getAllPlaceOfOrigin();
    const teaForm = editTeaForm(brands,teaTypes,packaging,placeOfOrigin);

    // set field values from values last saved in database 
    teaForm.fields.name.value = tea.get('name');
    teaForm.fields.brand_id.value = tea.get('brand_id');
    teaForm.fields.tea_type_id.value = tea.get('tea_type_id');
    teaForm.fields.packaging_id.value = tea.get('packaging_id');
    teaForm.fields.cost.value = tea.get('cost')/100;
    teaForm.fields.quantity.value = tea.get('quantity');
    teaForm.fields.weight.value = tea.get('weight');
    teaForm.fields.sachet.value = tea.get('sachet');
    teaForm.fields.image_url.value = tea.get('image_url');
    teaForm.fields.description.value = tea.get('description');
    teaForm.fields.brew_temperature.value = tea.get('brew_temperature');
    teaForm.fields.brew_water_quantity.value = tea.get('brew_water_quantity');
    teaForm.fields.brew_tea_weight.value = tea.get('brew_tea_weight');
    teaForm.fields.brew_sachet_quantity.value = tea.get('brew_sachet_quantity');
    teaForm.fields.brew_time.value = tea.get('brew_time');

    res.render('tea/edit',{
        form: teaForm.toHTML(bootstrapField),
        tea: tea.toJSON()
    })
})

router.post('/edit/:tea_id',async function(req,res){
    const tea = await dataLayer.getTeaById(req.params.tea_id);
    const teaTypes = await dataLayer.getAllTeaTypes();
    const brands = await dataLayer.getAllBrands();
    const packaging = await dataLayer.getAllPackaging();
    const placeOfOrigin = await dataLayer.getAllPlaceOfOrigin();
    const teaForm = editTeaForm(brands,teaTypes,packaging,placeOfOrigin);

    teaForm.handle(req,{
        'success':async function (teaForm){
            let {cost,...teaData} = teaForm.data;

            const teaLastModifiedDate= moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');
            
            tea.set('cost',teaForm.data.cost*100);
            tea.set('datetime_last_modified',teaLastModifiedDate)
            tea.set(teaData);
            await tea.save();

            res.redirect('/tea')
        },
        'error':function(teaForm){
            res.render('tea/edit',{
                form: teaForm.toHTML(bootstrapField),
                tea: tea.toJSON()
            })
        },
        'empty':function(teaForm){
            res.render('tea/edit',{
                form: teaForm.toHTML(bootstrapField),
                tea: tea.toJSON()
            })
        }
    })

})

router.get('/delete/:tea_id',async function(req,res){
    const tea = await dataLayer.getTeaById(req.params.tea_id);
    tea.destroy();
    res.redirect('/tea');
})

module.exports = router;