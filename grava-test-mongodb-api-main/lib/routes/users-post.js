'use strict';
const router = require('express').Router();
const logger = require('../logger');
const Joi = require('joi');
const { User, UserInformation } = require('../models');

function validateFields(req, res, next) {

    const schema = Joi.object({
        color: Joi.string().valid('red', 'green', 'blue').required(),
        email: Joi.string().required().email(),
        UserInformation: Joi.object({
            name: Joi.string().min(3).required(),
            lastName: Joi.string().required(),
            dni: Joi.string().required(),
            age: Joi.number()
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

async function saveUser(req, res) {

    try {
        const newUser = new User({
            email: req.body.email,
            color: req.body.color,
            enabled: req.body.enabled,
            userInformation: req.userInformation._id
        });

        await newUser.save();
        res.status(201).json(newUser.toJSON());

    } catch (error) {
        logger.error(`POST /users - saveUser error: ${error.message}`);
        res.status(500).json({
            code: 'internal_error',
            message: 'Internal error'
        });
    }
}

router.post('/users', validateFields, createUserInformation, saveUser);

module.exports = router;
