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
  return db.createTable('tea',{
    id:{type:'int',primaryKey:true,autoIncrement:true,unsigned:true},
    name:{type:'string',length:50, notNull:true},
    cost:{type:'int',unsigned:true, notNull:true},
    weight:{type:'smallint',unsigned:true, notNull:true, defaultValue:0},
    sachet:{type:'smallint',unsigned:true, notNull:true, defaultValue:0},
    image_url:{type:'string',length:255, notNull:true},
    description:{type:'string',length:400, notNull:true},
    brew_temperature:{type:'smallint',unsigned:true, notNull:true},
    brew_water_quantity:{type:'smallint',unsigned:true,notNull:true},
    brew_tea_weight:{type:'smallint',unsigned:true,notNull:true},
    brew_sachet_quantity:{type:'smallint',unsigned:true,notNull:true},
    brew_time:{type:'smallint',unsigned:true,notNull:true},
    datetime_created:{type:'datetime',notNull:true},
    datetime_last_modified:{type:'datetime',notNull:true}
  });
};

exports.down = function(db) {
  return db.dropTable('tea');
};

exports._meta = {
  "version": 1
};
