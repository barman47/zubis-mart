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

    userName: {
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
    },

    originalname: {
        type: String,
        required: true
    },

    image: {
        data: Buffer,
        contentType: String
    }
});

module.exports =  Product = mongoose.model('Product', ProductSchema);