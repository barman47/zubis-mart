const mongoose = require('mongoose');

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

    justEnabled: {
        type: Boolean
    },

    lastPaid: {
        type: Date,
    },

    stockTotal: {
        type: Number,
        default: 0
    },

    totalSales: {
        type: Number,
        default: 0
    }
});

module.exports =  User = mongoose.model('User', UserSchema);