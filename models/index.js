const bookshelf = require('../bookshelf');

const Tea = bookshelf.model('Tea',{
    tableName:'tea'
})


module.exports = {Tea}