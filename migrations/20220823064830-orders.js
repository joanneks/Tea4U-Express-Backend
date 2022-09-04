'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('orders',{
    id:{
      type:'int',
      unsigned:true,
      primaryKey:true,
      autoIncrement:true
    },
    shipping_address:{type:'string',length:100,notNull:true},
    postal_code:{type:'int',unsigned:true,notNull:true},
    remarks:{type:'string',length:'200',notNull:true, defaultValue:'nil'},
    datetime_created:{type:'datetime', notNull:true},
    datetime_last_modified:{type:'datetime', notNull:true},
    shipping_method_id:{
      type:'smallint',
      unsigned:true,
      notNull:true,
      foreignKey:{
        name:'order_shipping_method_fk',
        table:'shipping_methods',
        mapping:'id',
        rules:{
          onDelete:'cascade',
          onUpdate:'restrict'
        }
      }
    },
    order_status_id:{
      type:'int',
      unsigned:true,
      notNull:true,
      foreignKey:{
        name:'order_order_status_fk',
        table:'order_statuses',
        mapping:'id',
        rules:{
          onDelete:'cascade',
          onUpdate:'restrict'
        }
      }
    },
    customer_id:{
      type:'int',
      unsigned:true,
      notNull:true,
      foreignKey:{
        name:'customer_order_fk',
        table:'customers',
        mapping:'id',
        rules:{
          onDelete:'cascade',
          onUpdate:'restrict'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('orders');
};

exports._meta = {
  "version": 1
};
