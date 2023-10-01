'use strict';
const router = require('express').Router();
const {User, UserInformation} = require('../models');

async function getUsers(req, res) {

    try {

        const param = req.query.enabled;
        const filter = param === 'true' ? {enabled: true} : {enabled: false};

        const users = await User.find(filter);

        return res.status(200).json(users);

    } catch (error) {
        res.status(500).json({message: `Error when obtaining users: ${error}`});
    }

    return false;
}

const applySort = async (param) => {
    let query;

    switch (param) {
        case 'name':
            query = (await User.find().populate('userInformation')).sort((a, b) =>
                a.userInformation.name.localeCompare(b.userInformation.name)
            );
            break;
        case 'name2':
            query = (await User.find().populate('userInformation')).sort((a, b) =>
                a.userInformation.name.localeCompare(b.userInformation.name)
            );
            break;
        case 'lastName':
            query = (await User.find().populate('userInformation')).sort((a, b) =>
                a.userInformation.lastName.localeCompare(b.userInformation.lastName)
            );
            break;
        case 'email':
            query = (await User.find().sort({ email: 1 }));
            break;
        default:
            query = await User.find();
            break;
    }

    return query;
};


async function sortUsers(req, res) {
    try {
        const param = req.query.sortBy;

        const query = await applySort(param);

        const users = await query;

        return res.status(200).json(users);
    } catch (error) {

        res.status(500).json({message: `Error when sorting users: ${error.message}`});
    }

    return false;

}

async function getWorkInformation(req, res) {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).populate('work');

        if (!user) {
            return res.status(400).json({error: 'The user was not found.'});
        }

        const workInformation = user.work;

        return res.status(200).json({work: workInformation});
    } catch (error) {
        return res.status(500).json({error: `Internal error: ${error.message}`});
    }
}

router.get('/users/enabled', getUsers);
router.get('/users/sort', sortUsers);
router.get('/users/:id/workInformation', getWorkInformation);
module.exports = router;
