
const express = require('express');
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

//routes

const index = require ('./routes/index');
const create = require ('./routes/create_communication');
const display = require ('./routes/display_records');
const filtering = require ('./routes/filtering_records');

const path = require('path');

let app = express();

//View Engine Setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', index);
app.use('/create_communication', create);
app.use('/display', display);
app.use('/filtering', filtering);
app.use(express.static(__dirname + '/public'));



const server = app.listen(process.env.PORT || 3000, function () {
    let port = server.address().port;
    console.log("App now running on port", port);

});

module.exports = app;


