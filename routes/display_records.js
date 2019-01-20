const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('display_records', {title: 'Display'})
});

module.exports = router;