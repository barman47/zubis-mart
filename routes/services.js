const express = require('express');

const router = express.Router();

router.get('/accommodation', (req, res) => {
    Service.find({ category: 'Accommodation', hasPaid: true})
    .then((services) => {
        res.render('accommodation', {
            title: 'Services - Accommodation',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/catering', (req, res) => {
    Service.find({ category: 'Catering', hasPaid: true })
    .then((services) => {
        res.render('catering', {
            title: 'Services - Catering',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/furniture', (req, res) => {
    Service.find({ category: 'Furniture', hasPaid: true })
    .then((services) => {
        res.render('furniture', {
            title: 'Services - Furniture',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/hairStyling', (req, res) => {
    Service.find({ category: 'Hair Styling', hasPaid: true })
    .then((services) => {
        res.render('hairStyling', {
            title: 'Services - Hair Styling',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/homeAndDecor', (req, res) => {
    Service.find({ category: 'Home & Interior Decor', hasPaid: true })
    .then((services) => {
        res.render('homeAndDecor', {
            title: 'Services - Home and Interior Decoration',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/laundry', (req, res) => {
    Service.find({ category: 'Laundry', hasPaid: true })
    .then((services) => {
        res.render('laundry', {
            title: 'Services - Laundry',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/makeUp', (req, res) => {
    Service.find({ category: 'Make up', hasPaid: true })
    .then((services) => {
        res.render('makeUp', {
            title: 'Services - Make Up',
            style: 'services.css',
            script: 'services.js',
            services
        });
    })
    .catch((err) => {
        return console.log(err);
    });
});

router.get('/photography', (req, res) => {
    Service.find({ category: 'Photography', hasPaid: true })
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

router.get('/ushering', (req, res) => {
    Service.find({ category: 'Ushering', hasPaid: true })
    .then((services) => {
        res.render('ushering', {
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
    Service.find({ category: 'Gardening', hasPaid: true })
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
    Service.find({ category: 'MC & DJ', hasPaid: true })
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

router.get('/phoneAndLaptopRepairs', (req, res) => {
    Service.find({ category: 'Phone & Laptop Repairs', hasPaid: true })
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

router.get('/others', (req, res) => {
    Service.find({ category: 'Others', hasPaid: true })
    .then((services) => {
        res.render('otherServices', {
            title: 'Services - Other Services',
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