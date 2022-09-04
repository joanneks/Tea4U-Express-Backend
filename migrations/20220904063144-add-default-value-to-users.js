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
  let insertValues = [];
  insertValues.push(db.insert('users',
    ['first_name','last_name','username','email','password','datetime_created','datetime_last_modified'], ['Sally','Wu','sallywu','admin@tea4u.com','1fIlyd5p4fAYM2JC+JXBg1Rj6JIVZUOfGKuSw6jIaxc=','2022-08-24 18:20:01','2022-08-24 18:20:01']));
  for (let each of insertValues){
    return each
  }
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
