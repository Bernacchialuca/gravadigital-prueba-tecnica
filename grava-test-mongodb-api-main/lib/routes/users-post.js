'use strict';
const router = require('express').Router();
const logger = require('../logger');
const Joi = require('joi');
const { User, UserInformation, Work } = require('../models');

function validateFields(req, res, next) {

    const schema = Joi.object({
        color: Joi.string().valid('red', 'green', 'blue'),
        email: Joi.string().required().email(),
        enabled: Joi.boolean(),
        UserInformation: Joi.object({
            name: Joi.string().min(3).required(),
            lastName: Joi.string().required(),
            dni: Joi.string().required(),
            age: Joi.number()
        }),
        Work: Joi.object({
            direction: Joi.string().required(),
            position: Joi.string().required(),
            workmode: Joi.string().valid('remote', 'hybrid', 'presential').required()
        })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    return next();
}

async function createUserInformation(req, res, next) {

    const body = req.body.UserInformation;

    try {
        const result = await UserInformation.create({
            name: body.name,
            lastName: body.lastName,
            dni: body.dni,
            age: body.age
        });

        req.userInformation = result;
        return next();

    } catch (error) {
        res.status(400).json({ 'message': error });
    }

    return false;
}

async function createWorkInformation(req, res, next) {

    const body = req.body.Work;

    try {
        const result = await Work.create({
            direction: body.direction,
            position: body.position,
            workmode: body.workmode
        });

        req.Work = result;
        return next();

    } catch (error) {
        res.status(400).json({ 'message': error });
    }

    return false;
}

async function saveUser(req, res) {

    const body = req.body;

    try {
        const newUser = new User({
            email: body.email,
            color: body.color,
            enabled: body.enabled,
            userInformation: req.userInformation._id,
            work: req.Work._id
        });

        await newUser.save();
        res.status(201).json(newUser.toJSON());

    } catch (error) {
        logger.error(`POST /users - saveUser error: ${error.message}`);
        res.status(500).json({
            code: 'internal_error',
            message: `Internal error: ${error}`
        });
    }
}

async function disableUser(req, res) {
    try {

        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user || !user.enabled) {
            return res.status(400).json({ error: 'User does not exist or is already disabled.' });
        }

        user.enabled = false;
        await user.save();

        return res.status(200).json({ message: 'User successfully disabled.' });
    } catch (error) {
        return res.status(500).json({ error: `Internal error: ${error.message}` });
    }
}


router.post('/users', validateFields, createUserInformation, createWorkInformation, saveUser);
router.post('/users/:id/disable', disableUser);

module.exports = router;
