const bookshelf = require('../bookshelf');

const Tea = bookshelf.model('Tea',{
    tableName:'tea',
    teaType: function(){
        return this.belongsTo('TeaType');
    },
    brand: function(){
        return this.belongsTo('Brand');
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

module.exports = { Tea, TeaType, Brand }