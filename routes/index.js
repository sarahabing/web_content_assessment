const express = require('express');
const router = express.Router();
const config = require('../dbconfig');
const sql = require('mssql');



router.get('/', (req, res) => {
    (async function () {
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
                .query('select top 10 * from Assessment',function(err, recordset) {
                    console.log("recordset: ", recordset);
                    res.render('index', {json: JSON.stringify(recordset.recordset)});
                    sql.close();

                });
        } catch (err) {
            console.log(err);
            sql.close();

        }

    })()


});



module.exports = router;