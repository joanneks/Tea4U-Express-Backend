const express = require('express');
const { Tea } = require('../models');
const dataLayer = require('../dal/tea')
const router = express.Router();
const {createSearchForm } = require('../forms');

router.get('/', async function (req,res){
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
                query.where('quantity','>',searchForm.data.max_stock_count);
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
            res.status(200);
            res.json({
                tea: teaSearchResult.toJSON()
            })
        },
        'empty':async function(){
            res.status(200);
            res.json({
                tea: tea.toJSON(),
                message:"No search request submitted"
            })
        },
        'error': async function(){
            res.status(400);
            res.json({
                tea: tea.toJSON(),
                message:"Bad request - query failed, all tea products are displayed by default"
            })
        }
    })

})


module.exports = router;