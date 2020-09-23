
//MySQL
var mysql = require('mysql');

var Pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'car214',
    database: 'videostream'
});

module.exports = Pool;
