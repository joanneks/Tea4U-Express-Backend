const forms = require('forms');

const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createTeaForm = (brands,teaTypes) => {
    return forms.create({
        'name':fields.string({
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(5)]
        }),
        'brand_id':fields.string({
            label:'Brand',
            required:true,
            errorAfterField:true,
            widget:widgets.select(),
            choices:brands
        }),
        'tea_type_id':fields.string({
            label:'Tea Type',
            required:true,
            errorAfterField:true,
            widget:widgets.select(),
            choices:teaTypes
        }),
        'cost':fields.number({
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'quantity':fields.number({
            label:'Stock Quantity',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(1)]
        }),
        'weight':fields.number({
            label:'Product Weight (g)',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'sachet':fields.number({
            label:'Sachet Quantity',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'description':fields.string({
            label:'Description (max. 400 characters)',
            required:true,
            errorAfterField:true,
            widget:widgets.textarea(),
            validators:[validators.minlength(20),validators.maxlength(400)]
        }),
        'brew_temperature':fields.number({
            label:'Brew Temperature (°C)',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(60),validators.max(100)]
        }),
        'brew_water_quantity':fields.number({
            label:'Water Quantity (ml)',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'brew_tea_weight':fields.number({
            label:'Tea Leaves Amount (g)',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'brew_sachet_quantity':fields.number({
            label:'Sachet Quantity (pcs)',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'brew_time':fields.number({
            label:'Brew Time (min)',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'image_url':fields.url({
            label:'Image URL',
            required:true,
            errorAfterField:true,
            validators:[validators.maxlength(255)]
        })
    })
}

const editTeaForm = (brands,teaTypes) => {
    return forms.create({
        'name':fields.string({
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(5)]
        }),
        'brand_id':fields.string({
            label:'Brand',
            required:true,
            errorAfterField:true,
            widget:widgets.select(),
            choices:brands
        }),
        'tea_type_id':fields.string({
            label:'Tea Type',
            required:true,
            errorAfterField:true,
            widget:widgets.select(),
            choices:teaTypes
        }),
        'cost':fields.number({
            label:'Cost ($)',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'quantity':fields.number({
            label:'Stock Quantity',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(1)]
        }),
        'weight':fields.number({
            label:'Product Weight (g)',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'sachet':fields.number({
            label:'Sachet Quantity',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'description':fields.string({
            label:'Description (max. 400 characters)',
            required:true,
            errorAfterField:true,
            widget:widgets.textarea(),
            validators:[validators.minlength(20),validators.maxlength(400)]
        }),
        'brew_temperature':fields.number({
            label:'BrewTemperature (°C)',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(60),validators.max(100)]
        }),
        'brew_water_quantity':fields.number({
            label:'Water Quantity (ml)',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'brew_tea_weight':fields.number({
            label:'Tea Leaves Amount (g)',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'brew_sachet_quantity':fields.number({
            label:'Sachet Quantity (pcs)',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'brew_time':fields.number({
            label:'Brew Time (min)',
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'image_url':fields.url({
            label:'Image URL',
            required:true,
            errorAfterField:true,
            validators:[validators.maxlength(255)]
        })
    })
}


module.exports = {bootstrapField, createTeaForm, editTeaForm }