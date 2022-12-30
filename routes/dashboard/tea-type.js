const express =require('express');
const router = express.Router();
const {createTeaTypeForm, bootstrapField} = require('../../forms');
const dataLayer = require('../../dal/tea');
const {TeaType} = require('../../models');
const {checkIfAuthenticated} = require('../../middlewares');

router.get('/', checkIfAuthenticated,async function (req,res){
    const teaTypes = await dataLayer.getAllTeaTypes();
    const teaTypeForm  = createTeaTypeForm();
    res.render('dashboard/tea-type/index',{
        'form': teaTypeForm.toHTML(bootstrapField),
        'teaTypes': teaTypes.toJSON()
    });
    console.log('teatypees',teaTypes);
});

router.post('/', checkIfAuthenticated,async function (req,res){
    const teaTypes = await dataLayer.getAllTeaTypes();
    const teaTypeForm  = createTeaTypeForm("Tea Type Name");
    teaTypeForm.handle(req,{
        'success':async function (teaTypeForm){
            const teaType = new TeaType();
            teaType.set('name',teaTypeForm.data.name);
            await teaType.save();
            req.flash('success_messages',"New Tea Type created successfully");
            res.redirect('/tea-type');
        },
        'error':async function (teaTypeForm){
            res.render('dashboard/tea-type/index',{
                'form': teaTypeForm.toHTML(bootstrapField),
                'teaTypes': teaTypes.toJSON()
            });
        },
        'empty':async function (teaTypeForm){
            res.render('dashboard/tea-type/index',{
                'form': teaTypeForm.toHTML(bootstrapField),
                'teaTypes': teaTypes.toJSON()
            });
        },
    })
});

router.get('/edit/:tea_type_id', checkIfAuthenticated,async function (req,res){
    const teaTypeForm  = createTeaTypeForm("Update Tea Type Name");
    const teaTypes = await dataLayer.getAllTeaTypes();
    const teaType = await dataLayer.getTeaTypeById(req.params.tea_type_id);
    teaTypeForm.fields.name.value = teaType.get('name');

    teaTypeForm.handle(req,{
        'success':async function(teaTypeForm){
            res.render('dashboard/tea-type/edit',{
                'form': teaTypeForm.toHTML(bootstrapField),
                'teaTypes':teaTypes.toJSON(),
                'teaType':teaType.toJSON()
            });
        },
        'error':async function(teaTypeForm){
            res.render('dashboard/tea-type/edit',{
                'form': teaTypeForm.toHTML(bootstrapField),
                'teaTypes':teaTypes.toJSON(),
                'teaType':teaType.toJSON()
            });
        },
        'empty':async function(teaTypeForm){
            res.render('dashboard/tea-type/edit',{
                'form': teaTypeForm.toHTML(bootstrapField),
                'teaTypes':teaTypes.toJSON(),
                'teaType':teaType.toJSON()
            });
        },
    })
})

router.post('/edit/:tea_type_id', checkIfAuthenticated,async function (req,res){
    const teaTypeForm  = createTeaTypeForm("Update Tea Type Name");
    const teaTypes = await dataLayer.getAllTeaTypes();
    const teaType = await dataLayer.getTeaTypeById(req.params.tea_type_id);
    teaTypeForm.handle(req,{
        'success':async function(teaTypeForm){
            teaType.set(teaTypeForm.data);
            teaType.save();
            req.flash('success_messages',"Tea Type updated successfully");
            res.redirect('/tea-type')
        },
        'error':async function(teaTypeForm){
            res.render('dashboard/tea-type/edit',{
                'form': teaTypeForm.toHTML(bootstrapField),
                'teaTypes':teaTypes.toJSON(),
                'teaType':teaType.toJSON()
            });
        },
        'empty':async function(teaTypeForm){
            res.render('dashboard/tea-type/edit',{
                'form': teaTypeForm.toHTML(bootstrapField),
                'teaTypes':teaTypes.toJSON(),
                'teaType':teaType.toJSON()
            });
        },
    })
})

router.get('/delete/:tea_type_id', checkIfAuthenticated, async function (req,res){
    const teaType = await dataLayer.getTeaTypeById(req.params.tea_type_id);
    teaType.destroy();
    req.flash('success_messages',"Tea Type has been deleted");
    res.redirect('/tea-type');
})

module.exports = router;