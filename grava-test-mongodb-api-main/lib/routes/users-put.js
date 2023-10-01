'use strict';
const router = require('express').Router();
const { User } = require('../models');

async function updateEmail(req, res) {
    try {
        const userId = req.params.id;
        const newEmail = req.body.email;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'The user was not found.' });
        }

        if (!newEmail || newEmail.trim() === '') {
            return res.status(400).json({ error: 'The mail cannot be empty.' });
        }

        user.email = newEmail;

        await user.save();

        return res.status(200).json(user);
    } catch (error) {

        return res.status(500).json({ error: `Internal error: ${error.message}`});
    }
}


router.put('/users/:id/updateEmail', updateEmail);
module.exports = router;
