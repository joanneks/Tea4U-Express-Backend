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
  return db.createTable('users',{
    id:{type:'int',unsigned:true,primaryKey:true,autoIncrement:true},
    first_name:{type:'string',length:30,notNull:true},
    last_name:{type:'string',length:30,notNull:true},
    email:{type:'string',length:50,notNull:true},
    password:{type:'string',length:100,notNull:true},
    shipping_address:{type:'string',length:100,notNull:true},
    postal_code:{type:'smallint',unsigned:true,notNull:true},
    mobile_number:{type:'smallint',unsigned:true,notNull:true}
  });
};

exports.down = function(db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};
