const bookshelf = require('../bookshelf');

const Tea = bookshelf.model('Tea',{
    tableName:'tea',
    teaType: function(){
        return this.belongsTo('TeaType');
    },
    brand: function(){
        return this.belongsTo('Brand');
    },
    packaging: function(){
        return this.belongsTo('Packaging');
    },
    placeOfOrigin: function (){
        return this.belongsTo('PlaceOfOrigin');
    },
    tasteProfile: function (){
        return this.belongsToMany('TasteProfile');
    }
});

const Brand = bookshelf.model('Brand',{
    tableName:'brands',
    tea: function(){
        return this.hasMany('Tea');
    }
});

const TeaType = bookshelf.model('TeaType',{
    tableName:'tea_types',
    tea: function(){
        return this.hasMany('Tea');
    }
});

const Packaging = bookshelf.model('Packaging',{
    tableName:'packaging',
    tea: function (){
        return this.hasMany('Tea');
    }
});

const PlaceOfOrigin = bookshelf.model('PlaceOfOrigin',{
    tableName:'place_of_origin',
    tea: function(){
        return this.hasMany('Tea');
    }
});

const TasteProfile = bookshelf.model('TasteProfile',{
    tableName:'taste_profiles',
    tea: function(){
        return this.hasMany('Tea')
    }
})

module.exports = { Tea, TeaType, Brand, Packaging, PlaceOfOrigin, TasteProfile }