'use strict';
const router = require('express').Router();

router.get('/users', (req, res) => {
    const param = req.query;
    console.log(param);
});

module.exports = router;
