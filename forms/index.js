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

const createTeaForm = (brands,teaTypes,packaging,placeOfOrigins,tasteProfiles) => {
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
        'packaging_id':fields.string({
            required:true,
            errorAfterField:true,
            widget:widgets.select(),
            choices:packaging
        }),
        'cost':fields.number({
            required:true,
            errorAfterField:true,
            validators:[validators.min(0)]
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
        'place_of_origin_id':fields.string({
            label:'Place of Origin',
            required:true,
            errorAfterField:true,
            widget:widgets.select(),
            choices:placeOfOrigins
        }),
        'taste_profiles':fields.string({
            label:'Taste Profile(s)',
            required:true,
            errorAfterField:true,
            widget:widgets.multipleSelect(),
            choices:tasteProfiles
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
        'image_url':fields.string({
            widget:widgets.hidden()
        })
        // 'image_url':fields.url({
        //     label:'Image URL',
        //     required:true,
        //     errorAfterField:true,
        //     validators:[validators.maxlength(255)]
        // })
    })
}

const editTeaForm = (brands,teaTypes,packaging,placeOfOrigins,tasteProfiles) => {
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
        'packaging_id':fields.string({
            required:true,
            errorAfterField:true,
            widget:widgets.select(),
            choices:packaging
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
        'place_of_origin_id':fields.string({
            label:'Place of Origin',
            required:true,
            errorAfterField:true,
            widget:widgets.select(),
            choices:placeOfOrigins
        }),
        'taste_profiles':fields.string({
            required:true,
            errorAfterField:true,
            widget:widgets.multipleSelect(),
            choices:tasteProfiles
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
        'image_url':fields.string({
            widget:widgets.hidden()
        })
        // 'image_url':fields.url({
        //     label:'Image URL',
        //     required:true,
        //     errorAfterField:true,
        //     validators:[validators.maxlength(255)]
        // })
    })
}

const createUserForm = () => {
    return forms.create({
        'first_name':fields.string({
            label:'First Name',
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(2)]
        }),
        'last_name':fields.string({
            label:'Last Name',
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(2)]
        }),
        'username':fields.string({
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(5)]
        }),
        'email':fields.email({
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(8)]
        }),
        'password':fields.password({
            required:true,
            errorAfterField:true,
            // validators:[validators.minlength(8)]
        }),
        'confirm_password':fields.password({
            required:true,
            errorAfterField:true,
            validators: [ validators.matchField('password')]
        })
    })
}
const editUserForm = () => {
    return forms.create({
        'first_name':fields.string({
            label:'First Name',
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(2)]
        }),
        'last_name':fields.string({
            label:'Last Name',
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(2)]
        }),
        'username':fields.string({
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(5)]
        }),
        'email':fields.email({
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(8)]
        }),
    })
}

const editUserPasswordForm = () => {
    return forms.create({
        'former_password':fields.password({
            label:'Former password',
            required:true,
            errorAfterField:true,
            // validators:[validators.minlength(8)]
        }),
        'password':fields.password({
            label:'Change password',
            required:true,
            errorAfterField:true,
            // validators:[validators.minlength(8)]
        }),
        'confirm_password':fields.password({
            label:'Confirm New Password',
            required:true,
            errorAfterField:true,
            validators: [ validators.matchField('password')]
        })
    })
}

const createLoginForm = () => {
    return forms.create({
        'email':fields.email({
            required:true,
            errorAfterField:true
        }),
        'password':fields.password({
            required:true,
            errorAfterField:true
        })
    })
}

const createBrandForm = () => {
    return forms.create({
        'name':fields.string({
            label:'Brand Name',
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(2)]
        })
    })
}

const editBrandForm = () => {
    return forms.create({
        'name':fields.string({
            label:'Update Brand Name',
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(2)]
        })
    })
}

const createTasteProfileForm = () => {
    return forms.create({
        'name':fields.string({
            label:'Taste Profile',
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(5)]
        })
    })
}

const editTasteProfileForm = () => {
    return forms.create({
        'name':fields.string({
            label:'Update Taste Profile',
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(5)]
        })
    })
}

const createPlaceOfOriginForm = () => {
    return forms.create({
        'name':fields.string({
            label:'Place of Origin',
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(4)]
        })
    })
}

const editPlaceOfOriginForm = () => {
    return forms.create({
        'name':fields.string({
            label:'Update Place of Origin',
            required:true,
            errorAfterField:true,
            validators:[validators.minlength(4)]
        })
    })
}

module.exports = {
    bootstrapField, 
    createTeaForm, editTeaForm, 
    createUserForm, editUserForm, editUserPasswordForm, createLoginForm,
    createBrandForm, editBrandForm, 
    createTasteProfileForm, editTasteProfileForm, 
    createPlaceOfOriginForm, editPlaceOfOriginForm 
}