
const express = require('express');
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const config = require('./dbconfig');
const sql = require('mssql');


//routes

const index = require ('./routes/index');
const create = require ('./routes/create_communication');
const display = require ('./routes/display_records');
const filtering = require ('./routes/filtering_records');
const postCreate = require ('./routes/create');


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
app.use('/create', postCreate);

app.use(express.static(__dirname + '/public'));
app.post('/create', function (req, res) {

    (async function () {
        try {
            const id = req.body.person_id;
            const date = req.body.communication_date;
            const type = req.body.communication_type;
            const reason = req.body.reason;
            const direction = req.body.direction;

            let pool = await sql.connect(config);
            let transaction = await pool.transaction();
            transaction.begin(err=> {
                const request = new sql.Request(transaction);
                request.input('person_id', sql.Int, id);
                request.input('communication_date', sql.Date, date);
                request.input('communication_type', sql.VarChar(100), type);
                request.input('reason', sql.VarChar(100), reason);
                request.input('direction', sql.VarChar(100), direction);

                request.query("insert into Assessment values (@person_id, @communication_date, @communication_type, @reason, @direction)").
                then(()=> {
                    transaction.commit(err=> {
                        sql.close();
                        if (err){
                            console.log(err)

                        } else {

                            console.log('Transaction Commited');

                        }
                    });
                });


            });

        } catch (err) {
            console.log(err);
            sql.close();

        }



    })()



});



const server = app.listen(process.env.PORT || 3000, function () {
    let port = server.address().port;
    console.log("App now running on port", port);

});

module.exports = app;


