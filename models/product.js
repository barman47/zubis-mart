const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    user: {
        type: String,
        required: true
    },

    userEmail: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    }
});

module.exports =  Product = mongoose.model('Product', ProductSchema);