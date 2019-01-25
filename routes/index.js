const express = require('express');
const router = express.Router();
const config = require('../dbconfig');
const sql = require('mssql');
const paginate = require('express-paginate');
const app = require('../app');



router.get('/', (req, res) => {
    (async function () {
        try {
            let pool = await sql.connect(config);
            let request = await pool.request()
                .query('select * from Assessment order by person_id',function(err, recordset) {
                    //get column headings for the table
                    let col = [];
                    let row = [];
                    for (let i = 0; i < recordset.recordset.length; i++) {
                        for (let key in recordset.recordset[i]) {
                            if (col.indexOf(key) === -1) {
                                col.push(key);
                            }
                        }
                    }
                    const itemCount = 10;
                    const pageCount = Math.ceil(itemCount / req.query.limit);

                        //render the pug file
                        res.render('index', {col: col, recordset: recordset.recordset,
                            pageCount: pageCount,
                            itemCount: itemCount,
                            pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)});

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