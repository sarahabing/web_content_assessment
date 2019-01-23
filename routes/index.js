const express = require('express');
const router = express.Router();
const config = require('../dbconfig');
const sql = require('mssql');



router.get('/', (req, res) => {
    (async function () {
        try {
            let pool = await sql.connect(config);
            let request = await pool.request()
                .query('select top 10 * from Assessment',function(err, recordset) {
                    res.render('index', {json: JSON.stringify(recordset.recordsets)});
                    sql.close();

                });
        } catch (err) {
            console.log(err);
            sql.close();

        }

    })()


});



module.exports = router;