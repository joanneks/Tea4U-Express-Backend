const knex = require('knex')({
    client:'mysql',
    connection:{
        user:process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_DATABASE,
        host:process.env.DB_HOST
    }
});

// const knex = require('knex')({
//     client:'postgres',
//     connection:{
//         user:process.env.DB_USER,
//         password:process.env.DB_PASSWORD,
//         database:process.env.DB_DATABASE,
//         host:process.env.DB_HOST,
//         'ssl': {
//             'rejectUnauthorized': false
//         }
//     }
// });

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
