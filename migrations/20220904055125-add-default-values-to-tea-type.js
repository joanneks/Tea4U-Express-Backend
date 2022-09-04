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
  insertValues.push(db.insert('tea_types',
    ['name'], ['Oolong Tea']));
  insertValues.push(db.insert('tea_types',
    ['name'], ['Pu Erh Tea']));
  insertValues.push(db.insert('tea_types',
    ['name'], ['Black Tea']));
  insertValues.push(db.insert('tea_types',
    ['name'], ['White Tea']));
  insertValues.push(db.insert('tea_types',
    ['name'], ['Green Tea']));
  insertValues.push(db.insert('tea_types',
    ['name'], ['Tisane Tea']));
  insertValues.push(db.insert('tea_types',
    ['name'], ['Herbal Tea']));
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
