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
        type: Date,
        default: new Date()
    },

    lastLogin: {
        type: Date
    },

    hasPaid: {
        type: Boolean,
        default: false
    },

    paymentRequest: {
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