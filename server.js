var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var app = express();

// Tell Node where to find our static files
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use("/fonts", express.static(__dirname + '/public/fonts'));
app.use("/js", express.static(__dirname + '/public/js'));

app.use(bodyParser.json()); // for parsing application/json

app.get('/', function (req, res) {
    if (req.accepts('html')) {
        res.sendFile(`${__dirname}/public/index.html`)
    }
});

app.post('/rsvp', function (request, response) {
    var responseData = {
        success: false,
        failure: true,
        message : 'No RSVP was received'
    };

    // Ensure we received the data
    if (!request.body) {
        response.send(responseData);
    }

    var rsvpData = request.body;

    // TODO KK: validate rsvp data, send back error code if invalid

    if (rsvpData.attending === NaN ||
        rsvpData.attending < 0 ||
        rsvpData.attending > 1) {
        responseData.message = 'Select whether or not you will be attending the wedding.';
        response.send(responseData);
        response.end();
        return;
    }

    if (rsvpData.guestNames.length === 0) {
        responseData.message = 'Enter the names of the guests in your party.';
        response.send(responseData);
        response.end();
        return;
    }

    if (rsvpData.password.toLowerCase() !== 'kincade-schultz-2016') {
        responseData.message = 'The password you entered is incorrect.';
        response.send(responseData);
        response.end();
        return;
    }

    if (rsvpData.attending === 1 &&
        rsvpData.adultCount <= 0 &&
        rsvpData.childrenCount <= 0) {
        responseData.message = 'Select the number of adults and children in your party.';
        response.send(responseData);
        response.end();
        return;
    }

    sendRsvpEmail(rsvpData);

    responseData = {
        success: true,
        failure: false,
        message : 'Your RSVP was submitted successfully!'
    }
    response.send(responseData);
    response.end();
});

var sendRsvpEmail = function (rsvpData) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kincade.schultz.2016@gmail.com',
            pass: 'Rsvp@08#92$'
        }
    });

    var rsvpString = 'Attending: ' + (rsvpData.attending === 1) ? 'Yes' : 'No';
    rsvpString += '\nAdults: ' + rsvpData.adultCount;
    rsvpString += '\nGuest Names: ' + rsvpData.guestNames;
    rsvpString += '\nChildren: ' + rsvpData.childrenCount;
    rsvpString += '\nComment: ' + rsvpData.comment;

    var mailOptions = {
        from: 'kincade.schultz.2016@gmail.com',
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

var validateRsvp = function (rsvpData) {

}

// Set up a server-side listener for our site
var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port)
});