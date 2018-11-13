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

    stockTotal: {
        type: Number
    },

    totalProfit: {
        type: Number
    }
});

module.exports =  User = mongoose.model('User', UserSchema);