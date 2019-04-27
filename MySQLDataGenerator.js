const faker = require('faker');
var mysql = require('mysql');
var configWithDb = require('./configWithDb.js');
const { userSchema, apartmentSchema, reviewSchema} = require('./schema.js');
var connection = mysql.createConnection(configWithDb);

connection.connect();

// create tables
connection.query(userSchema, (err, results) => {
    if (err) {
        console.log(err);
    }
});

connection.query(apartmentSchema, (err, results) => {
    if (err) {
        console.log(err);
    }
});

connection.query(reviewSchema, (err, results) => {
    if (err) {
        console.log(err);
    }
});



// helper create users/apartments/review records

let userCount = 1;
let apartmentCount = 1;
let reviewCount = 1;

let createUsers = function() {
    let documentsArray = [];
    for (var i = 0; i < 1000; i++) {
        documentsArray.push([userCount, faker.name.findName(), faker.internet.avatar()]);
        userCount += 1;
    }
    return documentsArray;
};


let createReviews = function() {
    let documentsArray = [];
    for (var i = 0; i < 1000; i++) {
        documentsArray.push([
            reviewCount,
            faker.date.month() + ' ' + faker.random.number({ min: 2015, max: 2019}),
            faker.lorem.sentences(Math.ceil(Math.random() * 6)),
            Math.floor((() => Math.random() * 5)()) + .5,
            faker.random.number({
                min: 1,
                max: 100000
            }),
            faker.random.number({
                min: 1,
                max: 10000000
            }),
            Math.random() > .66,
            faker.lorem.sentences(Math.ceil(Math.random() * 4))
        ]);
        reviewCount += 1;
    }
    return documentsArray;
}


let createApartments = function() {
    let documentsArray = [];
    for (var i = 0; i < 1000; i++) {
        documentsArray.push([
            apartmentCount, 
            faker.address.streetAddress(), 
            Math.floor(Math.random()*10000000)
        ]);
        apartmentCount += 1;
    }
    return documentsArray;
}


// insert records

let insertUsersStatement = 'INSERT INTO users (id, name, avatar) VALUES ?';
let insertReviewsStatement = 'INSERT INTO reviews (id, date, text, rating, user_id, apartment_id, has_response, owner_response) VALUES ?';
let insertApartmentsStatement = 'INSERT INTO apartments (id, address, owned_by_user_id) VALUES ?';


let usersBatchCount = 0;
let reviewsBatchCount = 0;
let apartmentsBatchCount = 0;


let addUsers = function() {

    if (usersBatchCount < 100) {
        usersBatchCount += 1;
        let userDocs = createUsers();
        connection.query(insertUsersStatement, [userDocs], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(usersBatchCount);
                addUsers();
            }
        })
    } else {
        addReviews();
    }
};

let addReviews = function() {
    if (reviewsBatchCount < 50000) {
        reviewsBatchCount += 1;
        let reviewDocs = createReviews();
        connection.query(insertReviewsStatement, [reviewDocs], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(reviewsBatchCount);
                addReviews();
            }
        })
    } else {
        addApartments();
    }
};

let addApartments = function() {
    if (apartmentsBatchCount < 10000) {
        apartmentsBatchCount += 1;
        let apartmentDocs = createApartments();
        connection.query(insertApartmentsStatement, [apartmentDocs], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(apartmentsBatchCount);
                addApartments();
            }
        })
    } else {
        console.log('all records added');
        connection.query('ALTER TABLE reviews ADD INDEX (apartment_id);', (err, success) => {
            if (err) {
                console.log(err);
            } else {
                connection.query('ALTER TABLE users ADD INDEX (id);', (err, success) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('all indexes added');
                    }
                })
            }
        })
    }
};

addUsers();
