const express = require('express');
const router = express.Router();
const config = require('../dbconfig');
const sql = require('mssql');
const Chart = require('chartjs');
const cheerio = require('cheerio')

router.get('/', (req, res) => {
    (async function () {
        try {
            let pool = await sql.connect(config);
            let request = await pool.request()
                .query('select * from Assessment order by person_id',function(err, recordset) {
                    // const dom = new JSDOM(res);
                    // let canvas = dom.window.document.getElementById("myFirstChart");
                    const $ = cheerio.load(res);
                    let canvas = $('#myFirstChart');
                    $.html()

                    // let ctx = canvas.getContext('2d');

                    // Global Options:
                    // Chart.defaults.global.defaultFontColor = 'Tomato';
                    // Chart.defaults.global.defaultFontSize = 16;
                    //
                    // // Data with datasets options
                    // let data = {
                    //     labels: ["One", "Two", "Tree", "Four", "Five", "Six", "Seven"],
                    //     datasets: [
                    //         {
                    //             label: "Numbers !",
                    //             fill: true,
                    //             backgroundColor: "orange",
                    //             borderColor: "tomato",
                    //             data: recordset.recordset,
                    //         }
                    //     ]
                    // };
                    // // Chart declaration with some options:
                    // let myFirstChart = new Chart(ctx, {
                    //     type: 'line',
                    //     data: data,
                    //     options: {
                    //         title: {
                    //             fontSize: 20,
                    //             display: true,
                    //             text: 'My First Chart !'
                    //         }
                    //     }
                    // })

                    //render the pug file
                    res.render('get_graph', {recordset: recordset.recordset});
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