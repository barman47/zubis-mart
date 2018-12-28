const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Product = require('../models/product');

const mongoURI = require('../config/database').database;

const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true
});

conn.once('open', () => {
    console.log('Products File Upload Connection Established Successfully.');
});

conn.on('error', (err) => {
    console.log('File Connection Error... ' + err);
});

router.get('/phonesAndElectronics', (req, res) => {
    Product.find({category: 'Phones & Electronics'})
    .then((product) => {
        res.render('phonesAndElectronics', {
            title: 'Products - Phones & Electronics',
            style: 'products.css',
            script: 'products.js',
            product
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/cosmetics', (req, res) => {
    Product.find({category: 'Cosmetics'})
    .then((product) => {
        res.render('cosmetics', {
            title: 'Products - Cosmetics',
            style: 'products.css',
            script: 'products.js',
            product
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/books', (req, res) => {
    Product.find({category: 'Books'})
    .then((product) => {
        res.render('books', {
            title: 'Products - Books',
            style: 'products.css',
            script: 'products.js',
            product
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/fashion', (req, res) => {
    Product.find({category: 'Fashion'})
    .then((product) => {
        res.render('fashion', {
            title: 'Products - Fashion',
            style: 'products.css',
            script: 'products.js',
            product
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/homeAndFurniture', (req, res) => {
    Product.find({category: 'Home & Furniture'})
    .then((product) => {
        res.render('homeAndFurniture', {
            title: 'Products - Home & Furniture',
            style: 'products.css',
            script: 'products.js',
            product
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/vehicles', (req, res) => {
    Product.find({category: 'Vehicles'})
    .then((product) => {
        res.render('vehicles', {
            title: 'Products - Vehicles',
            style: 'products.css',
            script: 'products.js',
            product
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/others', (req, res) => {
    Product.find({category: 'Others'})
    .then((product) => {
        res.render('otherProducts', {
            title: 'Products - Others',
            style: 'products.css',
            script: 'products.js',
            product
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

module.exports = router