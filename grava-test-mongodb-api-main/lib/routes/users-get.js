'use strict';
const router = require('express').Router();
const { User, UserInformation } = require('../models');

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

const applySort = (param) => {
    let query;

    switch (param) {
        case 'name':
            query = UserInformation.find().sort({ name: 1 });
            break;
        case 'lastName':
            query = UserInformation.find().sort({ lastName: 1 });
            break;
        case 'email':
            query = User.find().sort({ email: 1 });
            break;
        default:
            query = User.find();
            break;
    }

    return query;
};

async function sortUsers(req, res) {
    try {
        const param = req.query.sortBy;

        const query = applySort(param);

        const users = await query;

        return res.status(200).json(users);
    } catch (error) {
  
        res.status(500).json({ message: 'Error when sorting users.' });
    }

    return false;

}

router.get('/users/enabled', getUsers);
router.get('/users/sort', sortUsers);
module.exports = router;
