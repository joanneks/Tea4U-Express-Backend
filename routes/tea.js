const express = require('express');
const { Tea } = require('../models');
const dataLayer = require('../dal/tea')
const router = express.Router();
const {bootstrapField, createTeaForm } = require('../forms');
const moment = require('moment');
const momentTimezone = require('moment-timezone');

router.get('/',async function (req,res){
    const tea = await Tea.collection().fetch({
        withRelated:['teaType','brand']
    });

    res.render('tea/index',{
        tea: tea.toJSON(),
    })
})

router.get('/create',async function (req,res){
    const teaTypes = await dataLayer.getAllTeaTypes();
    const teaForm = createTeaForm(teaTypes);
    res.render('tea/create',{
        formsTea: teaForm.toHTML(bootstrapField),
    })
})

router.post ('/create',async function (req,res){
    const teaTypes = await dataLayer.getAllTeaTypes();
    const brands = await dataLayer.getAllBrands();
    const teaForm = createTeaForm(brands,teaTypes);
    
    teaForm.handle(req,{
        'success':async function(teaForm){
            const tea = new Tea();
            let {cost,...teaData} = teaForm.data;
            const teaCreatedDate= moment().tz('Asia/Singapore').format('YYYY-MM-DD hh:mm:ss');
            const teaLastModifiedDate = teaCreatedDate;
            tea.set('cost',teaForm.data.cost*100);
            teaForm.data.datetime_created = teaCreatedDate;
            tea.set('datetime_created',teaCreatedDate);
            tea.set('datetime_last_modified',teaLastModifiedDate)
            tea.set(teaData);
            await tea.save();
            res.redirect('/tea');
        },
        'error':function(teaForm){
            res.render('tea/create',{
                formsTea: teaForm.toHTML(bootstrapField)
            })
        },
        'empty': function (teaForm){
            res.render('tea/create',{
                formsTea: teaForm.toHTML(bootstrapField)
            })
        }
    })
    
})

module.exports = router;