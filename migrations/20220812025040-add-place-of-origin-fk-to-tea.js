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
  return db.addColumn('tea','place_of_origin_id',{
    type:'int',
    unsigned:true,
    notNull:true,
    foreignKey:{
      name:'tea_place_of_origin_fk',
      table:'place_of_origin',
      mapping:'id',
      rules:{
        onDelete:'cascade',
        onUpdate:'restrict'
      }
    }
  });
};

exports.down = function(db) {
  return db.removeColumn('tea','place_of_origin_id');
};

exports._meta = {
  "version": 1
};
