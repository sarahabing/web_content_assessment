const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('filtering_records', {title: 'Filter'})
});

module.exports = router;