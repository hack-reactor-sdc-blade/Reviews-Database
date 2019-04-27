var mysql = require('mysql');
var configWithDb = require('../configWithDb.js');
var connection = mysql.createConnection(configWithDb);
connection.connect();


const getReviewsFromDatabase = (id, callback) => {
  connection.query(`SELECT users.name, users.avatar, reviews.date, reviews.text, reviews.rating, reviews.has_response, reviews.owner_response FROM users, reviews WHERE users.id = reviews.user_id AND reviews.apartment_id = ${id};`, (err, result) => {
    if (err) {
        console.log(err);
    } else {
      callback(null, result);
    }
  });
}

const getSearchResultsFromDatabase = (id, word, callback) => {
  connection.query(`SELECT users.name, users.avatar, reviews.date, reviews.text, reviews.rating, reviews.has_response, reviews.owner_response FROM users, reviews WHERE users.id = reviews.user_id AND reviews.apartment_id = ${id} AND (reviews.text LIKE '%${word}%' OR reviews.text LIKE '% ${word}%');`, (err, result) => {
    if (err) {
        console.log(err);
    } else {
      callback(null, result);
    }
  });
}



module.exports.getReviewsFromDatabase = getReviewsFromDatabase;
module.exports.getSearchResultsFromDatabase = getSearchResultsFromDatabase;