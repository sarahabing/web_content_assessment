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
const getGraph = require ('./routes/get_graph');


const paginate = require('express-paginate');



const path = require('path');

let app = express();

app.use(paginate.middleware(10, 50));

//View Engine Setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//routes
app.use('/', index);
app.use('/create_communication', create);
app.use('/display', display);
app.use('/filtering_records', filtering);
app.use('/create_success', postCreate);
app.use('/get_graph', getGraph);


//for stylesheet
app.use(express.static(__dirname + '/public'));


//filtering
//GET ENDPOINT
//http://localhost:3000/filter?date_1=2019-01-01&date_2=2019-01-31&reason=transfer&type=call
app.get('/filter', function(req,res){

    (async function () {
        try {
            let pool = await sql.connect(config);

            let type = req.query.type;
            let reason = req.query.reason;
            let date1 = req.query.date1;
            let date2 = req.query.date2;

            let data = {
                "Data":""
            };

            let request = new sql.Request(pool);

            //should be sum
            //can't sum a varchar? and converting/casting to int
            //throws an error on Datagrip

            //let query = "select count(reason) as theCount from Assessment where reason=@reason AND communication_type=@type communication_date BETWEEN @date_1 AND @date_2";
            let query = "select count(reason) as theCount from Assessment where communication_type= '"+ req.query.type +"' and reason= '" + req.query.reason + "' and communication_date between '"+ req.query.date_1 +"' and '" + req.query.date_2 + "'";

            request.query(query, function(err, recordset) {
                console.log(query);
                let data = {
                    "Data":""
                };
                if (recordset){
                    data["Data"] = recordset.recordsets[0];
                    res.send(data)
                    sql.close();
                } else {
                    data["Data"] = 'No data Found..';
                    res.json(data);
                    sql.close();

                }

            });
        } catch (err) {
            console.log(err);
            sql.close();

        }

    })()
});

//GET ENDPOINT
//http://localhost:3000/getRecords
app.get('/getRecords', function(req, res) {
    (async function () {
        try {
            let pool = await sql.connect(config);
            let request = await pool.request()
                .query('select * from Assessment order by person_id',function(err, recordset) {
                    let data = {
                        "Data":""
                    };
                    if(recordset){
                        data["Data"] = recordset.recordsets[0];
                        res.json(data);
                    }else{
                        data["Data"] = 'No data Found..';
                        res.json(data);
                    }

                    //close the session
                    sql.close();


                });
        } catch (err) {
            console.log(err);
            sql.close();

        }

    })();
});

//POST ENDPOINT
//http://localhost:3000/create
app.post('/create', function (req, res) {

    (async function () {
        try {
            let data;
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

                    transaction.commit((err)=> {
                        if (err){
                            data["Data"] = 'No data Found..';
                            res.send(data);
                            console.log(err)
                            sql.close();
                        } else {
                            res.send(req.body);
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
    })()
});

//PUT ENDPOINT
//http://localhost:3000/editUser/1
app.put('/editUser/:person_id', function(req, res) {
    (async function () {
        try {
            let data = {};
            let pool = await sql.connect(config);
            let request = await pool.request();
            let transaction = await pool.transaction();

            transaction.begin(err=> {
                const request = new sql.Request(transaction);
                request.query("UPDATE Assessment SET person_id= " + req.body.person_id  +  ", communication_type= '" +
                    req.body.communication_type + "', communication_date= '" + req.body.communication_date + "', reason= '"
                    + req.body.reason + "', direction= '" + req.body.direction + "' WHERE person_id= " + req.params.person_id).then(()=> {
                    transaction.commit((err)=> {
                        if (err){
                            res.send(data);
                            console.log(err);
                            sql.close();
                        } else {
                            res.send(req.body);
                            console.log('Transaction Changed');
                            sql.close();

                        }
                    });
                });
            });


        } catch (err) {
            console.log(err);
            sql.close();

        }

    })();
});

//DELETE ENDPOINT
//http://localhost:3000/deleteUser/1
app.delete('/deleteUser/:person_id', function(req, res) {
    (async function () {
        try {
            let data = {};
            let pool = await sql.connect(config);
            let request = await pool.request();
            let transaction = await pool.transaction();

            transaction.begin(err=> {
                const request = new sql.Request(transaction);
                request.query("DELETE FROM Assessment WHERE person_id=" + req.params.person_id).then(()=> {
                    transaction.commit((err)=> {
                        if (err){

                            res.send(data);
                            console.log(err);
                            sql.close();
                        } else {
                            data= {"Data": "Row Deleted"};
                            res.send(data);
                            console.log('Row Deleted');
                            sql.close();

                        }
                    });
                });
            });


        } catch (err) {
            console.log(err);
            sql.close();

        }

    })();
});

//listening on port 3000
const server = app.listen(process.env.PORT || 3000, function () {
    let port = server.address().port;
    console.log("App now running on port", port);

});

module.exports = app;


