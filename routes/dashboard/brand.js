const express =require('express');
const router = express.Router();
const {createBrandForm, bootstrapField} = require('../../forms');
const dataLayer = require('../../dal/brand');
const {Brand} = require('../../models');
const {checkIfAuthenticated} = require('../../middlewares');

router.get('/', checkIfAuthenticated,async function (req,res){
    const brands = await dataLayer.getAllBrands();
    const brandForm  = createBrandForm();
    res.render('dashboard/brand/index',{
        'form': brandForm.toHTML(bootstrapField),
        'brands': brands.toJSON()
    });
});

router.post('/', checkIfAuthenticated,async function (req,res){
    const brands = await dataLayer.getAllBrands();
    const brandForm  = createBrandForm("Brand Name");
    brandForm.handle(req,{
        'success':async function (brandForm){
            const brand = new Brand();
            brand.set('name',brandForm.data.name);
            await brand.save();
            req.flash('success_messages',"New Tea Brand created successfully");
            res.redirect('/brand');
        },
        'error':async function (brandForm){
            res.render('dashboard/brand/index',{
                'form': brandForm.toHTML(bootstrapField),
                'brands': brands.toJSON()
            });
        },
        'empty':async function (brandForm){
            res.render('dashboard/brand/index',{
                'form': brandForm.toHTML(bootstrapField),
                'brands': brands.toJSON()
            });
        },
    })
});

router.get('/edit/:brand_id', checkIfAuthenticated,async function (req,res){
    const brandForm  = createBrandForm("Update Brand Name");
    const brands = await dataLayer.getAllBrands();
    const brand = await dataLayer.getBrandById(req.params.brand_id);
    brandForm.fields.name.value = brand.get('name');

    brandForm.handle(req,{
        'success':async function(brandForm){
            res.render('dashboard/brand/edit',{
                'form': brandForm.toHTML(bootstrapField),
                'brands':brands.toJSON(),
                'brand':brand.toJSON()
            });
        },
        'error':async function(brandForm){
            res.render('dashboard/brand/edit',{
                'form': brandForm.toHTML(bootstrapField),
                'brands':brands.toJSON(),
                'brand':brand.toJSON()
            });
        },
        'empty':async function(brandForm){
            res.render('dashboard/brand/edit',{
                'form': brandForm.toHTML(bootstrapField),
                'brands':brands.toJSON(),
                'brand':brand.toJSON()
            });
        },
    })
})

router.post('/edit/:brand_id', checkIfAuthenticated,async function (req,res){
    const brandForm  = createBrandForm("Update Brand Name");
    const brands = await dataLayer.getAllBrands();
    const brand = await dataLayer.getBrandById(req.params.brand_id);
    brandForm.handle(req,{
        'success':async function(brandForm){
            brand.set(brandForm.data);
            brand.save();
            req.flash('success_messages',"Tea Brand updated successfully");
            res.redirect('/brand')
        },
        'error':async function(brandForm){
            res.render('dashboard/brand/edit',{
                'form': brandForm.toHTML(bootstrapField),
                'brands':brands.toJSON(),
                'brand':brand.toJSON()
            });
        },
        'empty':async function(brandForm){
            res.render('dashboard/brand/edit',{
                'form': brandForm.toHTML(bootstrapField),
                'brands':brands.toJSON(),
                'brand':brand.toJSON()
            });
        },
    })
})

router.get('/delete/:brand_id', checkIfAuthenticated, async function (req,res){
    const brand = await dataLayer.getBrandById(req.params.brand_id);
    brand.destroy();
    req.flash('success_messages',"Tea Brand has been deleted");
    res.redirect('/brand');
})

module.exports = router;