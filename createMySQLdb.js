let config = require('./config.js');
let mysql = require('mysql');
let connection = mysql.createConnection(config);

connection.connect();

connection.query('CREATE DATABASE IF NOT EXISTS airbnb', (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log('airbnb db created');
    }
});