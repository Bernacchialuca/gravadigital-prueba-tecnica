'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workSchema = new Schema({
    direction: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    workmode: {
        type: String,
        enum: ['remote', 'hybrid', 'presential'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Work', workSchema);
