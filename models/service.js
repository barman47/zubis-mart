const mongoose = require('mongoose');

const ServiceSchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },

    userEmail: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    dateCreated: {
        type: Number,
        default: new Date(),
        index: true
    },

    hasPaid: {
        type: Boolean
    }
});

module.exports =  Service = mongoose.model('Service', ServiceSchema);