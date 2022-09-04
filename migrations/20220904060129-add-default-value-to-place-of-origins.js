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
  insertValues.push(db.insert('place_of_origin',
    ['name'], ['Not Applicable']));
  insertValues.push(db.insert('place_of_origin',
    ['name'], ['Yun Nan']));
  insertValues.push(db.insert('place_of_origin',
    ['name'], ['Taiwan']));
  insertValues.push(db.insert('place_of_origin',
    ['name'], ['Hang Zhou']));
  insertValues.push(db.insert('place_of_origin',
    ['name'], ['Fu Jian']));
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
