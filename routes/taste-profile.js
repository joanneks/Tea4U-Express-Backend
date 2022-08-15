const express =require('express');
const router = express.Router();
const {createTasteProfileForm, editTasteProfileForm, bootstrapField} = require('../forms');
const dataLayer = require('../dal/taste-profile');
const {TasteProfile} = require('../models');

router.get('/',async function (req,res){
    const tasteProfiles = await dataLayer.getAllTasteProfiles();
    console.log(tasteProfiles.toJSON());
    const tasteProfileForm  = createTasteProfileForm();
    res.render('dashboard/taste-profile/index',{
        'form': tasteProfileForm.toHTML(bootstrapField),
        'tasteProfiles': tasteProfiles.toJSON()
    });
});

router.post('/',async function (req,res){
    const tasteProfiles = await dataLayer.getAllTasteProfiles();
    const tasteProfileForm  = createTasteProfileForm();
    tasteProfileForm.handle(req,{
        'success':async function (tasteProfileForm){
            const tasteProfile = new TasteProfile();
            tasteProfile.set('name',tasteProfileForm.data.name);
            await tasteProfile.save();
            res.redirect('/taste-profile');
        },
        'error':async function (tasteProfileForm){
            res.render('dashboard/taste-profile/index',{
                'form': tasteProfileForm.toHTML(bootstrapField),
                'tasteProfiles': tasteProfiles.toJSON()
            });
        },
        'empty':async function (tasteProfileForm){
            res.render('dashboard/taste-profile/index',{
                'form': tasteProfileForm.toHTML(bootstrapField),
                'tasteProfiles': tasteProfiles.toJSON()
            });
        },
    })
});

router.get('/edit/:taste_profile_id',async function (req,res){
    const tasteProfiles = await dataLayer.getAllTasteProfiles();
    const tasteProfileForm  = editTasteProfileForm();
    const tasteProfile = await dataLayer.getTasteProfileById(req.params.taste_profile_id);
    tasteProfileForm.fields.name.value = tasteProfile.get('name');

    tasteProfileForm.handle(req,{
        'success':async function(tasteProfileForm){
            res.render('dashboard/taste-profile/edit',{
                'form': tasteProfileForm.toHTML(bootstrapField),
                'tasteProfiles':tasteProfiles.toJSON(),
                'tasteProfile':tasteProfile.toJSON()
            });
        },
        'error':async function(tasteProfileForm){
            res.render('dashboard/taste-profile/edit',{
                'form': tasteProfileForm.toHTML(bootstrapField),
                'tasteProfiles':tasteProfiles.toJSON(),
                'tasteProfile':tasteProfile.toJSON()
            });
        },
        'empty':async function(tasteProfileForm){
            res.render('dashboard/taste-profile/edit',{
                'form': tasteProfileForm.toHTML(bootstrapField),
                'tasteProfiles':tasteProfiles.toJSON(),
                'tasteProfile':tasteProfile.toJSON()
            });
        },
    })
})

router.post('/edit/:taste_profile_id',async function (req,res){
    const tasteProfiles = await dataLayer.getAllTasteProfiles();
    const tasteProfileForm  = editTasteProfileForm();
    const tasteProfile = await dataLayer.getTasteProfileById(req.params.taste_profile_id);
    tasteProfileForm.handle(req,{
        'success':async function(tasteProfileForm){
            tasteProfile.set(tasteProfileForm.data);
            tasteProfile.save();
            res.redirect('/taste-profile')
        },
        'error':async function(tasteProfileForm){
            res.render('dashboard/taste-profile/edit',{
                'form': tasteProfileForm.toHTML(bootstrapField),
                'tasteProfiles':tasteProfiles.toJSON(),
                'tasteProfile':tasteProfile.toJSON()
            });
        },
        'empty':async function(tasteProfileForm){
            res.render('dashboard/taste-profile/edit',{
                'form': tasteProfileForm.toHTML(bootstrapField),
                'tasteProfiles':tasteProfiles.toJSON(),
                'tasteProfile':tasteProfile.toJSON()
            });
        },
    })
})

router.get('/delete/:taste_profile_id', async function (req,res){
    const tasteProfile = await dataLayer.getTasteProfileById(req.params.taste_profile_id);
    tasteProfile.destroy();
    res.redirect('/taste-profile');
})

module.exports = router;