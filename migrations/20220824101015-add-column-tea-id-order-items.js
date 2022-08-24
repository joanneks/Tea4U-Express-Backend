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
  return db.addColumn('order_items','tea_id',{
    type: 'int',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: 'order_item_tea_fk',
      table: 'tea',
      mapping: 'id',
      rules: {
        onDelete: 'cascade',
        onUpdate: 'restrict'
      }
    }
  });
};

exports.down = function(db) {
  return db.removeColumn('order_items','tea_id')
};

exports._meta = {
  "version": 1
};
