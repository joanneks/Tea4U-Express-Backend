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

const User = bookshelf.model('User',{
    tableName:'users'
})

const Customer = bookshelf.model('Customer',{
    tableName:'customers',
    order(){
        return this.hasMany('Order')
    }
})

const CartItem = bookshelf.model('CartItem',{
    tableName:'cart_items',
    tea(){
        return this.belongsTo('Tea');
    },
    user(){
        return this.belongsTo('Customer')
    },
})

const CartItemTest = bookshelf.model('CartItemTest',{
    tableName:'cart_items_test',
    tea(){
        return this.belongsTo('Tea');
    },
    user(){
        return this.belongsTo('User')
    }
})

const ShippingMethod = bookshelf.model('ShippingMethod',{
    tableName:'shipping_methods',
    order(){
        return this.hasMany('Order')
    }
})

const OrderStatus = bookshelf.model('OrderStatus',{
    tableName:'order_statuses',
    order(){
        return this.hasMany('Order')
    }
})

const OrderItem = bookshelf.model('OrderItem',{
    tableName:'order_items',
    order(){
        return this.belongsTo('Order')
    },
    tea(){
        return this.belongsTo('Tea');
    }
})

const Order = bookshelf.model('Order',{
    tableName:'orders',
    orderStatus(){
        return this.belongsTo('OrderStatus')
    },
    shippingMethod(){
        return this.belongsTo('ShippingMethod')
    },
    user(){
        return this.belongsTo('Customer')
    },
    orderItem(){
        return this.hasMany('OrderItem')
    }
})

module.exports = { 
    Tea, TeaType, 
    Brand, Packaging, PlaceOfOrigin, TasteProfile, 
    User, Customer,
    CartItem, CartItemTest,
    ShippingMethod, OrderStatus, OrderItem, Order
}