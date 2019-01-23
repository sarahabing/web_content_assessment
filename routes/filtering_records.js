const express = require('express');
const router = express.Router();
const config = require('../dbconfig');
const sql = require('mssql');

router.get('/', (req, res) => {
  res.render('filtering_records', {title: "Filtering"});
});

module.exports = router;