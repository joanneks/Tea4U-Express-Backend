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
  return db.createTable('tea_taste_profiles',{
    id:{type:'int',unsigned:true,primaryKey:true,autoIncrement:true},
    'tea_id':{
      type:'int',
      unsigned:true,
      notNull:true,
      foreignKey:{
        name:'tea_taste_profiles_tea_fk',
        table:'tea',
        mapping:'id',
        rules:{
          onDelete:'cascade',
          onUpdate:'restrict'
        }
      }
    },
    'taste_profile_id':{
      type:'int',
      unsigned:true,
      notNull:true,
      foreignKey:{
        name:'tea_taste_profiles_taste_profile_fk',
        table:'taste_profiles',
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
  return null;
};

exports._meta = {
  "version": 1
};
