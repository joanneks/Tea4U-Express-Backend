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
  insertValues.push(db.insert('brands',
    ['name'], ['Kindred Teas']));
  insertValues.push(db.insert('brands',
    ['name'], ['Qi-Cha']));
  insertValues.push(db.insert('brands',
    ['name'], ['Tea Spoon of Love']));
  insertValues.push(db.insert('brands',
    ['name'], ['Tea Chapter']));
  insertValues.push(db.insert('brands',
    ['name'], ['Pekoe and Imp']));
  insertValues.push(db.insert('brands',
    ['name'], ['Pryce Tea']));
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
