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
  return db.createTable('shipping_methods',{
    id:{type:'smallint',unsigned:true,primaryKey:true,autoIncrement:true},
    name:{type:'string',length:20,notNull:true},
    price:{type:'int',notNull:true,unsigned:true},
    min_days:{type:'smallint',unsigned:true,notNullL:true},
    max_days:{type:'smallint',unsigned:true,notNullL:true}
  });
};

exports.down = function(db) {
  return db.dropTable('shipping_methods');
};

exports._meta = {
  "version": 1
};
