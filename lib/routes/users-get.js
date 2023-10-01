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
        res.status(500).json({ message: 'Error when obtaining users', error: error });
    }

    return false;
}

const applySort = async(param) => {

    const query = await User.find().populate('userInformation');

    switch (param) {
        case 'name':
            query.sort((a, b) =>
                a.userInformation.name.localeCompare(b.userInformation.name)
            );
            break;
        case 'dni':
            query.sort((a, b) =>
                a.userInformation.dni.localeCompare(b.userInformation.dni)
            );
            break;
        case 'age':
            query.sort((a, b) =>
                a.userInformation.age - b.userInformation.age
            );
            break;
        case 'email':
            query.sort((a, b) =>
                a.email.localeCompare(b.email)
            );
            break;
        default:
            query.sort((a, b) =>
                a.userInformation.lastName.localeCompare(b.userInformation.lastName)
            );
    }

    return query;
};


async function sortUsers(req, res) {
    try {
        const param = req.query.sortBy;

        const users = await applySort(param);

        return res.status(200).json(users);
    } catch (error) {

        res.status(500).json({ message: 'Error when sorting users', error: error });
    }

    return false;

}

async function getWorkInformation(req, res) {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).populate('work');

        if (!user) {
            return res.status(400).json({ error: 'The user was not found.' });
        }

        const workInformation = user.work;

        return res.status(200).json({ work: workInformation });
    } catch (error) {
        return res.status(500).json({ message: 'Internal error', error: error });
    }
}

router.get('/users/enabled', getUsers);
router.get('/users/sort', sortUsers);
router.get('/users/:id/workInformation', getWorkInformation);
module.exports = router;
