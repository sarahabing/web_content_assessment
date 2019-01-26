const express = require('express');
const router = express.Router();
const config = require('../dbconfig');
const sql = require('mssql');

const app = require('../app');
const ChartjsNode = require('chartjs-node');


router.get('/', (req, res) => {

    let chartNode = new ChartjsNode(600, 600);
    let chartJsOptions = {
        type: 'pie',
        data: recordset.recordset
    };

    return chartNode.drawChart(chartJsOptions).then(()=>{

        return chartNode.getImageBuffer('image/png');


    }).then(buffer=>{
        Array.isArray(buffer);
        return chartNode.getImageStream('image/png');
    }).then(streamResult=>{
        return chartNode.writeImageToFile('image/png', './testimage.png');


    })

});

module.exports = router;