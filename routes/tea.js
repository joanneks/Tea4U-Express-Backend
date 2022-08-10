const express = require('express');
const { Tea } = require('../models');
const router = express.Router();
const {bootstrapField, createTeaForm} = require('../forms');

router.get('/',async function (req,res){
    const tea = await Tea.collection().fetch({});

    res.render('tea/index',{
        tea: tea.toJSON(),
    })
})

router.get('/create',function (req,res){
    packaging = ['loose-leaf','sachets']
    const teaForm = createTeaForm(packaging);
    res.render('tea/create',{
        forms: teaForm.toHTML(bootstrapField)
    })

})

module.exports = router;