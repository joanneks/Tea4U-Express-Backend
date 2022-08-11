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
  return db.addColumn('tea','packaging_id',{
    type:'smallint',
    unsigned:true,
    notNull:true,
    foreignKey:{
      name:'tea_packaging_fk',
      table:'packaging',
      mapping:'id',
      rules:{
        onDelete:'cascade',
        onUpdate:'restrict'
      }
    }
  });
};

exports.down = function(db) {
  return db.removeColumn('tea','packaging_id');
};

exports._meta = {
  "version": 1
};
