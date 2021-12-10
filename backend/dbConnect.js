let mysql = require('mysql');

// Connexion à MYSQL
let db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : process.env.SQL_MDP,
    database : 'groupomania'
});

module.exports = db;