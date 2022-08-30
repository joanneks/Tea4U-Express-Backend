const express = require('express');
const { Tea } = require('../../models');
const dataLayer = require('../../dal/tea')
const router = express.Router();
const {createSearchForm } = require('../../forms');

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
                if(req.query.name){
                    query.where('name','like','%'+ req.query.name + '%');
                };
            } else if(process.env.DB_DRIVER == "postgres"){
                if(req.query.name){
                    query.where('name','ilike','%'+ req.query.name + '%');
                };
            }
            if(req.query.min_cost){
                query.where('cost','>=',req.query.min_cost*100);
            };
            if(req.query.max_cost){
                query.where('cost','<=',req.query.max_cost*100);
            };
            // if(req.query.min_stock_count){
            //     query.where('quantity','>',searchForm.data.max_stock_count);
            // };
            if (req.query.brand_id && req.query.brand_id != "0") {
                query.where('brand_id', '=', req.query.brand_id);
            };
            if (req.query.tea_type_id && req.query.tea_type_id != "0") {
                query.where('tea_type_id', '=', req.query.tea_type_id);
            };
            if (req.query.packaging_id && req.query.packaging_id != "0") {
                query.where('packaging_id', '=', req.query.packaging_id);
            };
            if (req.query.place_of_origin_id && req.query.place_of_origin_id != "0") {
                query.where('place_of_origin_id', '=', req.query.place_of_origin_id);
            };
            if(req.query.taste_profiles){
                query.query('join','taste_profiles_tea','tea.id','tea_id').where(
                    'taste_profile_id' , 'in', searchForm.data.taste_profiles.split(',')
                );
            };

            const teaSearchResult =await query.fetch({
                withRelated:['teaType','brand','packaging','placeOfOrigin','tasteProfile']
            });
            console.log('req.query',req.query);
            console.log(teaSearchResult.toJSON().length)
            res.status(200);
            res.json({
                tea: teaSearchResult.toJSON(),
                teaTypes,
                brands,
                packaging,
                placeOfOrigins,
                tasteProfiles,
                message:"Search completed"
            })
        },
        'empty':async function(){
            res.status(200);
            res.json({
                tea: tea.toJSON(),
                teaTypes,
                brands,
                packaging,
                placeOfOrigins,
                tasteProfiles,
                message:"No search request submitted"
            })
        },
        'error': async function(){
            res.status(400);
            res.json({
                tea: tea.toJSON(),
                teaTypes,
                brands,
                packaging,
                placeOfOrigins,
                tasteProfiles,
                message:"Bad request - query failed, all tea products are displayed by default"
            })
        }
    })

})


module.exports = router;