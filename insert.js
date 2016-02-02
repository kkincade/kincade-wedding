// 1. Run "mysql.server start"
// 2. Run "mysql -p"
// 3. Enter password "kincade-mysql"
// 4. Within mysql, run "use wedding;"

/**
 * Schema of RSVP table

CREATE TABLE lu_rsvp (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    attending BOOL NOT NULL,
    adultCount INT NOT NULL,
    childrenCount INT NOT NULL,
    guestNames VARCHAR(250),
    veganCount INT NOT NULL,
    vegetarianCount INT NOT NULL,
    glutenFreeCount INT NOT NULL,
    comment LONGTEXT
);

*/

var mysql = require('mysql');

var database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kincade-mysql',
    database: 'wedding'
});

database.connect();

var rsvp = {

};

connection.query('insert into lu_rsvp set ?', rsvp, function (err, result) {

});