'use strict';
const router = require('express').Router();
const { User } = require('../models');

async function getUsers(req, res) {

    try {

        const param = req.query.enabled;
        const filter = param === 'true' ? { enabled: true } : { enabled: false };

        const users = await User.find(filter);

        return res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: 'Error when obtaining users.' });
    }

    return false;
}

router.get('/users', getUsers);

module.exports = router;
