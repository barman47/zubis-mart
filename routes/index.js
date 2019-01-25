const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    Product.find({ hasPaid: true }, {}, {limit: 12, sort: {dateCreated: -1}}, (err, returnedProducts) => {
        if (err) {
            return console.log(err);
        }
        res.render('index', {
            title: 'Zubis Mart - Home',
            style: 'index.css',
            script: 'index.js',
            returnedProducts
        });
    });
});

router.get('/sell', (req, res) => {
    res.render('sell', {
        title: 'Zubis Mart - Sell',
        style: 'sell.css',
        script: 'sell.js'
    });
});

router.post('/search', (req, res) => {
    Product.find({ $text: {$search: `"${req.body.search}"`}, hasPaid: true }, {score: {$meta: "textScore"}})
        .sort({score:{$meta:"textScore"}})
        .then((products) => {
            Service.find({ $text: {$search: `"${req.body.search}"`}, hasPaid: true }, {score: {$meta: "textScore"}})
            .sort({score:{$meta:"textScore"}})
            .then((services) => {
                res.render('searchResults', {
                    title: `Zubismart - ${req.body.search}`,
                    style: 'searchResults.css',
                    script: 'searchResults.js',
                    searchBox: req.body.search,
                    products,
                    services
                });
            })
            .catch((err) => {
                if (err) {
                    return console.log(err);
                }
            });
        })
        .catch((err) => {
            if (err) {
                return console.log(err);
            }
        });
});

router.get('/termsOfUse', (req, res) => {
    res.render('termsOfUse', {
        title: 'Zubismart - Terms of Use',
        style: 'terms.css',
        script: 'terms.js'
    });
});

module.exports = router;