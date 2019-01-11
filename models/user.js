const mongoose = require('mongoose');
const moment = require('moment');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },
    
    password: {
        type: String,
        required: true
    },

    createdAt: {
        type: String,
        default: moment().format('MMMM Do YYYY') 
    },

    lastLogin: {
        type: Date
    },

    hasPaid: {
        type: Boolean,
        default: false
    },

    lastPaid: {
        type: Date,
    },

    stockTotal: {
        type: Number
    },

    totalProfit: {
        type: Number
    }
});

module.exports =  User = mongoose.model('User', UserSchema);