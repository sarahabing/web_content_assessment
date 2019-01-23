const express = require('express');
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

//database requires
const config = require('./dbconfig');
const sql = require('mssql');


//routes
const index = require ('./routes/index');
const create = require ('./routes/create_communication');
const display = require ('./routes/display_records');
const filtering = require ('./routes/filtering_records');
const postCreate = require ('./routes/create_success');


const path = require('path');

let app = express();

//View Engine Setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//routes
app.use('/', index);
app.use('/create_communication', create);
app.use('/display', display);
app.use('/filtering_records', filtering);
app.use('/create_success', postCreate);

//for stylesheet
app.use(express.static(__dirname + '/public'));

//get request on filtering page
app.get('/filter', function(req,res){

    (async function () {
        try {
            let pool = await sql.connect(config);
            let startDate = req.body.date_1;
            let endDate = req.body.date_2;
            let type = req.body.type;
            let reason = req.body.reason;
            let data = {
                "Data":""
            };

            let request = new sql.Request(pool);
            request.input('date_1', sql.Date, startDate);
            request.input('date_2', sql.VarChar(100), endDate);
            request.input('reason', sql.VarChar(100), reason);
            request.input('type', sql.VarChar(100), type);
            let query = "select count(reason) from Assessment where communication_date BETWEEN @date_1 AND @date_2 AND communication_type = @type AND reason = @reason";

            request.query(query, function(err, rows) {
                console.log(query)
                if(rows){
                    data["Data"] = rows.recordsets;
                    res.json(data);
                }else{
                    data["Data"] = 'No data Found..';
                    res.json(data);
                }
                sql.close();

            });
        } catch (err) {
            console.log(err);
            sql.close();

        }

    })()
});

//post request on create records page
//why is the response blank even though it
//writes to the database?
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
                        if (err){
                            console.log(err)
                            sql.close();
                        } else {
                            console.log('Transaction Committed');
                            sql.close();

                        }
                    });
                });
            });
        } catch (err) {
            console.log(err);
            sql.close();
        }
        res.redirect('/create_success');
    })()
});


//listening on port 3000
const server = app.listen(process.env.PORT || 3000, function () {
    let port = server.address().port;
    console.log("App now running on port", port);

});

module.exports = app;


