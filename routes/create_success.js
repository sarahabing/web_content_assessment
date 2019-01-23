const express = require('express');
const router = express.Router();
const config = require('../dbconfig');
const sql = require('mssql');

router.get('/', (req, res) => {
    res.render('create_success', {title: 'Create'})
});

module.exports = router;