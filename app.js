const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const express = require('express');
const index = require ('./routes/index');
const path = require('path');
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

//View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', index);

//Getting Database info, which I used Azure for
//because it was quick and easy.
const config =
    {
        options: {
            database: 'Assessment',
            encrypt: true
        },
        authentication: {
            type: "default",
            options: {
                userName: "abingsa",
                password: "Sceptile321!",
            }
        },
        server: 'assessmentsaraha.database.windows.net',
    };

//Establishing the Connection...
const connection = new Connection(config);

connection.on('connect', (err) => {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('Connected to ' + config.server);
    }
});

module.exports = app;


