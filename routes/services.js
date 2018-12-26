const express = require('express');

const router = express.Router();

router.get('/photography', (req, res) => {
    Service.find({category: 'Photography'})
    .then((services) => {
        res.render('photography', {
            title: 'Services - Photography',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/homeCleaning', (req, res) => {
    Service.find({category: 'Home Cleaning'})
    .then((services) => {
        res.render('homeCleaning', {
            title: 'Services - Home Cleaning',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/ushering', (req, res) => {
    Service.find({category: 'Ushering'})
    .then((services) => {
        res.render('photography', {
            title: 'Services - Ushering',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/gardening', (req, res) => {
    Service.find({category: 'Gardening'})
    .then((services) => {
        res.render('gardening', {
            title: 'Services - Gardening',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/mc', (req, res) => {
    Service.find({category: 'MC'})
    .then((services) => {
        res.render('mc', {
            title: 'Services - MC',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/performersAndArtistes', (req, res) => {
    Service.find({category: 'Performers/Artistes'})
    .then((services) => {
        res.render('performersAndArtistes', {
            title: 'Services - Performers / Artistes',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/fashion', (req, res) => {
    Service.find({category: 'Fashion'})
    .then((services) => {
        res.render('fashionServices', {
            title: 'Services - Fashion',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/phoneAndLaptopRepairs', (req, res) => {
    Service.find({category: 'Phone & Laptop Repairs'})
    .then((services) => {
        res.render('phoneAndLaptopRepairs', {
            title: 'Services - Phone & Laptop Repairs',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

module.exports = router;