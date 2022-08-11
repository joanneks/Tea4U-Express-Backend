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
  return db.changeColumn('tea','brew_temperature',{type:'smallint',unsigned:true, notNull:true});
};

exports.down = function(db) {
  return db.changeColumn('tea','brew_temperature',{type:'tinyint',unsigned:true, notNull:true});
};

exports._meta = {
  "version": 1
};
