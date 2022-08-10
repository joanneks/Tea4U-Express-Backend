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

const createTeaForm = (packaging) => {
    return forms.create({
        'name':fields.string({
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(5)]
        }),
        'cost':fields.number({
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'weight':fields.number({
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'sachet':fields.number({
            required:true,
            errorAfterField:true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'image_url':fields.string({
            required:true,
            errorAfterField:true
        })
        // 'packaging':fields.string({
        //     required:true,
        //     errorAfterField:true,
        //     widget:widgets.select(),
        //     choices:packaging
        // })
    })
}


module.exports = {bootstrapField, createTeaForm}