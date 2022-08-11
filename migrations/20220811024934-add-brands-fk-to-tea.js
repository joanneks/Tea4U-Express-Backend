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
  return db.addColumn('tea','brand_id',{
    type:'smallint',
    unsigned:true,
    notNull:true,
    foreignKey:{
      name:'tea_brand_fk',
      table:'brands',
      mapping:'id',
      rules:{
        onDelete:'cascade',
        onUpdate:'restrict'
      }
    }
  });
};

exports.down = function(db) {
  return db.removeColumn('tea','brand_id');;
};

exports._meta = {
  "version": 1
};
