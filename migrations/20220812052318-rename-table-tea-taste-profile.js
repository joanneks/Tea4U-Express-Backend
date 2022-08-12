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
  return db.renameTable('tea_taste_profiles','taste_profiles_tea');
};

exports.down = function(db) {
  return db.renameTable('taste_profiles_tea','tea_taste_profiles');;
};

exports._meta = {
  "version": 1
};
