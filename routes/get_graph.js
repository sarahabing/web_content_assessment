const express = require('express');
const router = express.Router();
const config = require('../dbconfig');
const sql = require('mssql');
const fs = require('fs');



router.get('/', (req, res) => {
    (async function () {

        try {
            let pool = await sql.connect(config);
            let request = await pool.request()
                .query('select * from Assessment order by person_id', function(err, recordset) {

                    // const csvString = fs.readFileSync('Assessment.csv').toString();
                    // const data = d3.csvParse(csvString);
                    // output('./public/images/chart', d3nPie({ data: data }));



                    //render the pug file
                    res.render('get_graph');
                    //close the session
                    sql.close();
                });


        } catch (err) {
            console.log(err);
            sql.close();

        }

    })()
});


module.exports = router;