const express = require('express');
const { Tea } = require('../models');
const dataLayer = require('../dal/tea')
const router = express.Router();
const {bootstrapField, createTeaForm, createSearchForm } = require('../forms');
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const {checkIfAuthenticated} = require('../middlewares');

router.get('/', checkIfAuthenticated, async function (req,res){
    const tea = await dataLayer.getAllTea();
    const teaTypes = await dataLayer.getAllTeaTypes();
    const brands = await dataLayer.getAllBrands();
    const packaging = await dataLayer.getAllPackaging();
    const placeOfOrigins = await dataLayer.getAllPlaceOfOrigins();
    const tasteProfiles = await dataLayer.getAllTasteProfiles();
    // const tasteProfiles = await dataLayer.getAllTasteProfiles();

    let query = Tea.collection();
    teaTypes.unshift([0, '--- All TeaTypes ---']);
    brands.unshift([0, '--- All Brands ---']);
    packaging.unshift([0, '--- All Packaging ---']);
    placeOfOrigins.unshift([0, '--- All Place of Origin ---']);

    const searchForm = createSearchForm(brands,teaTypes,packaging,placeOfOrigins,tasteProfiles);
    searchForm.handle(req,{
        'success': async function(searchForm){
            if(process.env.DB_DRIVER == "mysql"){
                if(searchForm.data.name){
                    query.where('name','like','%'+ searchForm.data.name + '%');
                };
            } else if(process.env.DB_DRIVER == "postgres"){
                if(searchForm.data.name){
                    query.where('name','ilike','%'+ searchForm.data.name + '%');
                };
            }
            if(searchForm.data.min_cost){
                query.where('cost','>=',searchForm.data.min_cost*100);
            };
            if(searchForm.data.max_cost){
                query.where('cost','<=',searchForm.data.max_cost*100);
            };
            if(searchForm.data.min_stock_count){
                query.where('quantity','>',searchForm.data.min_stock_count);
            };
            if(searchForm.data.max_stock_count){
                query.where('quantity','<',searchForm.data.max_stock_count);
            };
            if (searchForm.data.brand_id && searchForm.data.brand_id != "0") {
                query.where('brand_id', '=', searchForm.data.brand_id);
            };
            if (searchForm.data.tea_type_id && searchForm.data.tea_type_id != "0") {
                query.where('tea_type_id', '=', searchForm.data.tea_type_id);
            };
            if (searchForm.data.packaging_id && searchForm.data.packaging_id != "0") {
                query.where('packaging_id', '=', searchForm.data.packaging_id);
            };
            if (searchForm.data.place_of_origin_id && searchForm.data.place_of_origin_id != "0") {
                query.where('place_of_origin_id', '=', searchForm.data.place_of_origin_id);
            };
            if(searchForm.data.taste_profiles){
                query.query('join','taste_profiles_tea','tea.id','tea_id').where(
                    'taste_profile_id' , 'in', searchForm.data.taste_profiles.split(',')
                );
            };

            const teaSearchResult =await query.fetch({
                withRelated:['teaType','brand','packaging','placeOfOrigin','tasteProfile']
            });

            res.render('tea/index',{
                form: searchForm.toHTML(bootstrapField),
                tea: teaSearchResult.toJSON(),
            })
        },
        'empty':async function(){
            res.render('tea/index',{
                form: searchForm.toHTML(bootstrapField),
                tea: tea.toJSON(),
            })
        },
        'error': async function(){
            res.render('tea/index',{
                form: searchForm.toHTML(bootstrapField),
                tea: tea.toJSON(),
            })
        }
    })

})

router.get('/create', checkIfAuthenticated, async function (req,res){
    const teaTypes = await dataLayer.getAllTeaTypes();
    const brands = await dataLayer.getAllBrands();
    const packaging = await dataLayer.getAllPackaging();
    const placeOfOrigins = await dataLayer.getAllPlaceOfOrigins();
    const tasteProfiles = await dataLayer.getAllTasteProfiles();
    const teaForm = createTeaForm(brands,teaTypes,packaging,placeOfOrigins,tasteProfiles,1);
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
    const teaForm = createTeaForm(brands,teaTypes,packaging,placeOfOrigins,tasteProfiles,1);
    
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
    const teaForm = createTeaForm(brands,teaTypes,packaging,placeOfOrigins,tasteProfiles,0);

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
    const teaForm = createTeaForm(brands,teaTypes,packaging,placeOfOrigins,tasteProfiles,0);

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