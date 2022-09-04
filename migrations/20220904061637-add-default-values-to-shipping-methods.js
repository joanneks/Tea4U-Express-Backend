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
  insertValues.push(db.insert('shipping_methods',
    ['name','price','min_days','max_days'], ['Standard','399',5,7]));
  insertValues.push(db.insert('shipping_methods',
    ['name','price','min_days','max_days'], ['Express','599',2,4]));
  insertValues.push(db.insert('shipping_methods',
    ['name','price','min_days','max_days'], ['Same-Day Delivery','799',1,1]));
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
