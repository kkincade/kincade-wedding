// Modules to include
var http = require('http');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var app = express();

// Tell Node where to find our static files
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use("/fonts", express.static(__dirname + '/public/fonts'));
app.use("/js", express.static(__dirname + '/public/js'));

// For parsing application/json
app.use(bodyParser.json());

/**
 * Return the index.html page for the home directory.
 */
app.get('/', function (req, res) {
    if (req.accepts('html')) {
        res.sendFile(`${__dirname}/public/index.html`)
    }
});

/**
 * Handle RSVP through the route /rsvp.
 */
app.post('/rsvp', function (request, response) {
    var rsvpData = request.body;
    var responseData = validateRsvp(rsvpData);

    if (responseData.success) {
        // Log RSVP data to database
        logRsvpToDatabase(rsvpData);

        // Send RSVP data via email
        sendRsvpEmail(rsvpData);
    }

    // Return response to client side
    response.send(responseData);
    response.end();
});

/**
 * Stores the RSVP data into the MySQL database.
 */
var logRsvpToDatabase = function (rsvpData) {
    var database = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'kincade-mysql',
        database: 'wedding'
    });

    database.connect();

    // Format the data for the database
    var rsvp = {
        firstName: rsvpData.firstName,
        lastName: rsvpData.lastName,
        attending: rsvpData.attending,
        adultCount: rsvpData.adultCount,
        childrenCount: rsvpData.childrenCount,
        guestNames: rsvpData.guestNames,
        veganCount: rsvpData.veganCount,
        vegetarianCount: rsvpData.vegetarianCount,
        glutenFreeCount: rsvpData.glutenFreeCount,
        comment: rsvpData.comment
    };

    database.query('insert into lu_rsvp set ?', rsvp, function (err, result) {
        if (err) {
            console.error(err);
            return;
        }

        console.info(result);
    });
};

/**
 * Creates and sends an email with the RSVP details.
 */
var sendRsvpEmail = function (rsvpData) {
    var fullName = (rsvpData.firstName + ' ' + rsvpData.lastName).trim();

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kincade.schultz.2016@gmail.com',
            pass: 'Rsvp@08#92$'
        }
    });

    

    var rsvpString = 'Name: ' + fullName;
    rsvpString += '\nAttending: ' + ((rsvpData.attending === 1) ? 'Yes' : 'No');
    rsvpString += '\nAdults: ' + rsvpData.adultCount;
    rsvpString += '\nChildren: ' + rsvpData.childrenCount;
    rsvpString += '\nGuest names: ' + rsvpData.guestNames;
    rsvpString += '\nVegan meals: ' + rsvpData.veganCount;
    rsvpString += '\nVegetarian meals: ' + rsvpData.vegetarianCount;
    rsvpString += '\nGluten-free meals: ' + rsvpData.glutenFreeCount;
    rsvpString += '\nComment: ' + rsvpData.comment;

    var mailOptions = {
        to: 'kincade.schultz.2016@gmail.com',
        subject: 'RSVP Received',
        text: rsvpString
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        };
    });
};

/**
 * Valdiates the fields from the RSVP. Returns a JSON object indicating whether
 * or not the RSVP was valid and a corresponding message.
 */
var validateRsvp = function (rsvpData, response) {
    var responseData = {
        success: false,
        failure: true,
        message : 'No RSVP data was received. Please contact Kameron about this issue.'
    };

    // Ensure we received the data
    if (!rsvpData) {
        return responseData;
    }

    // Attendance radios
    if (rsvpData.attending === NaN ||
        rsvpData.attending < 0 ||
        rsvpData.attending > 1) {
        responseData.message = 'Select whether or not you will be attending the wedding.';
        return responseData;
    }

    // Number of adults and children
    if (rsvpData.attending === 1 &&
        rsvpData.adultCount <= 0 &&
        rsvpData.childrenCount <= 0) {
        responseData.message = 'Select the number of adults and children in your party.';
        return responseData;
    }

    // First and last name
    if (typeof rsvpData.firstName === 'undefined' || rsvpData.firstName.length === 0 ||
        typeof rsvpData.lastName === 'undefined' || rsvpData.lastName.length === 0) {
        responseData.message = 'Enter your first and last name.';
        return responseData;
    }

    // Guest Names
    if ((rsvpData.adultCount + rsvpData.childrenCount >= 2) &&
        (typeof rsvpData.guestNames === 'undefined' || rsvpData.guestNames.length === 0)) {
        responseData.message = 'Enter the names of the other guests in your party.';
        return responseData;
    }

    // Password
    if (typeof rsvpData.password === 'undefined' || rsvpData.password.toLowerCase() !== 'kincade-schultz-2016') {
        responseData.message = 'The password you entered is incorrect.';
        return responseData;
    }

    // Return success
    responseData.success = true;
    responseData.failure = false;
    responseData.message = 'Your RSVP was submitted successfully!'
    return responseData;
}

// Set up a server-side listener for our site
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port)
});