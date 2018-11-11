const mongoose = require('mongoose');

const ServiceSchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },

    user: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    }
});

module.exports =  Service = mongoose.model('Service', ServiceSchema);