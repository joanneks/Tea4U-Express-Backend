const express = require('express');
const { Tea } = require('../models');
const dataLayer = require('../dal/tea')
const router = express.Router();
const {bootstrapField, createTeaForm, editTeaForm } = require('../forms');
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const {checkIfAuthenticated} = require('../middlewares');

router.get('/', checkIfAuthenticated, async function (req,res){
    const tea = await dataLayer.getAllTea();

    res.render('tea/index',{
        tea: tea.toJSON(),
    })
})

router.get('/create', checkIfAuthenticated, async function (req,res){
    const teaTypes = await dataLayer.getAllTeaTypes();
    const brands = await dataLayer.getAllBrands();
    const packaging = await dataLayer.getAllPackaging();
    const placeOfOrigins = await dataLayer.getAllPlaceOfOrigins();
    const tasteProfiles = await dataLayer.getAllTasteProfiles();
    const teaForm = createTeaForm(brands,teaTypes,packaging,placeOfOrigins,tasteProfiles);
    res.render('tea/create',{
        form: teaForm.toHTML(bootstrapField),
        'cloudinaryName':process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey':process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset':process.env.CLOUDINARY_UPLOAD_PRESET,
    })
})

router.post ('/create', checkIfAuthenticated, async function (req,res){
    const teaTypes = await dataLayer.getAllTeaTypes();
    const brands = await dataLayer.getAllBrands();
    const packaging = await dataLayer.getAllPackaging();
    const placeOfOrigins = await dataLayer.getAllPlaceOfOrigins();
    const tasteProfiles = await dataLayer.getAllTasteProfiles();
    const teaForm = createTeaForm(brands,teaTypes,packaging,placeOfOrigins,tasteProfiles);
    
    teaForm.handle(req,{
        'success':async function(teaForm){
            const tea = new Tea();
            let {cost,taste_profiles,...teaData} = teaForm.data;

            const teaCreatedDate= moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');
            const teaLastModifiedDate = teaCreatedDate;

            tea.set('cost',teaForm.data.cost*100);
            tea.set('image_url',teaForm.data.image_url);
            tea.set('datetime_created',teaCreatedDate);
            tea.set('datetime_last_modified',teaLastModifiedDate);
            tea.set(teaData);

            await tea.save();

            if(teaForm.data.taste_profiles){
                await tea.tasteProfile().attach(teaForm.data.taste_profiles.split(','));
            };

            req.flash('success_messages',"Tea Product created successfully");
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

router.get('/edit/:tea_id', checkIfAuthenticated, async function(req,res){
    const tea = await dataLayer.getTeaById(req.params.tea_id);
    const teaTypes = await dataLayer.getAllTeaTypes();
    const brands = await dataLayer.getAllBrands();
    const packaging = await dataLayer.getAllPackaging();
    const placeOfOrigins = await dataLayer.getAllPlaceOfOrigins();
    const tasteProfiles = await dataLayer.getAllTasteProfiles();
    const teaForm = editTeaForm(brands,teaTypes,packaging,placeOfOrigins,tasteProfiles);

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

    let selectedTasteProfiles = await tea.related('tasteProfile').pluck('id');
    console.log('selected taste profiles ----',selectedTasteProfiles);
    teaForm.fields.taste_profiles.value = selectedTasteProfiles;

    res.render('tea/edit',{
        form: teaForm.toHTML(bootstrapField),
        tea: tea.toJSON(),
        'cloudinaryName':process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey':process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset':process.env.CLOUDINARY_UPLOAD_PRESET,
    })
})

router.post('/edit/:tea_id', checkIfAuthenticated, async function(req,res){
    const tea = await dataLayer.getTeaById(req.params.tea_id);
    const teaTypes = await dataLayer.getAllTeaTypes();
    const brands = await dataLayer.getAllBrands();
    const packaging = await dataLayer.getAllPackaging();
    const placeOfOrigins = await dataLayer.getAllPlaceOfOrigins();
    const tasteProfiles = await dataLayer.getAllTasteProfiles();
    const teaForm = editTeaForm(brands,teaTypes,packaging,placeOfOrigins,tasteProfiles);

    teaForm.handle(req,{
        'success':async function (teaForm){
            let {cost,taste_profiles,...teaData} = teaForm.data;
            console.log('teaform.data',teaForm.data);
            const teaLastModifiedDate= moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');
            
            tea.set('cost',teaForm.data.cost*100);
            tea.set('datetime_last_modified',teaLastModifiedDate)
            tea.set(teaData);
            await tea.save();

            let tasteProfileIds = taste_profiles.split(',').map(id => parseInt(id));
            console.log(tasteProfileIds);
            let existingTasteProfilesIds = await tea.related('tasteProfile').pluck('id');
            console.log(existingTasteProfilesIds);
            let toRemove = existingTasteProfilesIds.filter( id => tasteProfileIds.includes(id) === false);
            console.log(toRemove);
            await tea.tasteProfile().detach(toRemove);
            await tea.tasteProfile().attach(tasteProfileIds)
            req.flash('success_messages',"Tea Product updated successfully");
            res.redirect('/tea');
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

router.get('/delete/:tea_id', checkIfAuthenticated, async function(req,res){
    const tea = await dataLayer.getTeaById(req.params.tea_id);
    tea.destroy();
    req.flash('success_messages',"Tea Product has been deleted");
    res.redirect('/tea');
})

module.exports = router;