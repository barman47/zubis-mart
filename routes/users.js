const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const passport = require('passport');

const Product = require('../models/product');

const config = require('../config/database');

mongoose.connect(config.database, {
    useNewUrlParser: true
});

let conn = mongoose.connection;

conn.once('open', () => {
    console.log('Database File Upload Connection Established Successfully.');
});

conn.on('error', (err) => {
    console.log('File Connection Error... ' + err);
});

let gridfs;
let Image;

const User = require('../models/user');
const Service = require('../models/service');
// let Image = require('../models/image');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage });

const router = express.Router();

router.post('/register', (req, res) => {
    const body = req.body;
    const newUser = {
        firstName: body.firstName.toUpperCase(),
        lastName: body.lastName.toUpperCase(),
        email: body.email,
        phone: body.phone,
        password: body.password
    };
    
    req.checkBody('firstName', 'First Name is required').notEmpty();
    req.checkBody('lastName', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Invalid Email Address').isEmail();
    req.checkBody('phone', 'Invalid Phone Number').notEmpty();
    req.checkBody('password', 'Invalid Password').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        console.log('errors ', errors);
        res.status(406).json({ msg: errors });
        res.end();
    } else {
        let user = new User({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
            password: newUser.password
        });

        User.findOne({email: user.email}, (err, returnedUser) => {
            if (err) {
                return console.log(err);
            } else if (returnedUser) {
                res.status(501).json({ msg: 'A User with this email already exists!' });
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        return console.log(err);
                    }
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) {
                            return console.log(err);
                        }
                        user.password = hash;
                        user.save((err) => {
                            if (err) {
                                return console.log(err);
                            } else {
                                res.status(200).json({ msg: 'Registration Successful!' });
                            }   
                        });
                    });
                });
            }
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('user', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(404).json({ msg: 'Incorrect Email or Password' });
        }
        req.logIn(user, (err) => {
            let id = user._id;
            id = mongoose.Types.ObjectId(id); 
            res.status(200).json({ 
                msg: 'User Logged In',
                id 
            });
        });
    })(req, res, next);
});

router.get('/:id', (req, res) => {
    User.findOne({_id: req.params.id}, (err, user) => {
        if (err) {
            return console.log(err)
        } else {
            res.render('index', {
                title: 'Zubis Mart - Home',
                style: 'index.css',
                script: 'index.js',
                user
            });
        }
    });
});

router.get('/:id/account', (req, res) => {
    User.findOne({_id: req.params.id}, (err, user) => {
        if (err) {
            return console.log(err);
        } else {
            res.render('dashboard', {
                title: `Zubis Mart - ${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`,
                style: 'dashboard.css',
                script: 'dashboard.js',
                user,
                firstName: user.firstName.toLowerCase(),
                lastName: user.lastName.toLowerCase()
            });
        }
    });
});

router.post('/addService', (req, res) => {
    const service = new Service({
        category: req.body.category,
        user: req.body.user,
        description: req.body.description
    });

    service.save((err, savedService) => {
        if (err) {
            return console.log(err);
        } else {
            console.log('Service added Successfully');
            res.status(200).json({
                message: 'Service added Successfully',
                category: savedService.category,
                description: savedService.description
            });
        }
    });
});

router.post('/:id/upload', upload.single('itemImage'), (req, res) => {
    // console.log('file ', req.file);
    const file = req.file;
    User.findOne({_id: req.params.id}, (err, returnedUser) => {
        if (err) {
            return console.log(err);
        } else {
            gridfs = require('mongoose-gridfs')({
                collection: 'images',
                model: 'Image',
                mongooseConnection: conn
            });
            Image = gridfs.model;
            Image.write({
                // filename: newImage.image.data = fs.readFileSync(req.file.path);
                filename: file.filename,
                contentType: file.mimetype,
            }, fs.createReadStream(file.path), (err, createdImage) => {
                if (err) {
                    return console.log(err);
                } else {
                    Image.readById(createdImage._id, (err, returnedImage) => {
                        if (err) {
                            return console.log(err)
                        } else {
                            Image.updateOne({_id: createdImage._id}, {$set: {metadata: {
                                itemName:req.body.itemName,
                                category: req.body.itemCategory,
                                user: `${returnedUser.firstName} ${returnedUser.lastName}`,
                                userEmail: returnedUser.email,
                                description: req.body.itemDescription,
                                price: req.body.itemPrice
                            }}}, (err, updatedImage) => {
                                if (err) {
                                    return console.log(err);
                                } else {
                                    let product = new Product({
                                        _id: updatedImage._id,
                                        name: req.body.itemName,
                                        category: req.body.itemCategory,
                                        user: `${returnedUser.firstName} ${returnedUser.lastName}`,
                                        userEmail: returnedUser.email,
                                        description: req.body.itemDescription,
                                        price: req.body.itemPrice
                                    });
                                    product.save((err, savedProduct) => {
                                        if (err) {
                                            return console.log(err);
                                        } else {
                                            res.redirect(`/users/${req.params.id}/account`);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

// router.get('/image', (req, res) => {
//     User.read({}, (err, returnedFile) => {
//         if (err) {
//             return console.log(err);
//         } else {
//             // const readStream = gridfs.createReadStream(returnedFile.filename);
//             res.render('/image', {
//                 src: returnedFile.filename
//             });
//         }
//     });
// });

//Saves Image to database
// router.post('/:id/upload', upload.single('itemImage'), (req, res) => {
//     console.log('body ', req.body);
//     console.log('file ', req.file);
//     const newImage = new Image();
//     newImage.image.data = fs.readFileSync(req.file.path);
//     newImage.image.contentType = req.file.mimetype;
//     newImage.name = req.body.itemName;
//     newImage.user = 'Uzoanya Dominic';
//     newImage.category = req.body.itemCategory;
//     newImage.description = req.body.itemDescription;

//     newImage.save((err, savedImage) => {
//         if (err) {
//             return console.log(err);
//         } else {
//             res.contentType(savedImage.image.contentType);
//             res.send(savedImage.image.data);
//         }
//     });
//     // res.status(200).json({ message: 'File Uplaoded Successfully' });
// });

router.get('/logout/:id', (req, res) => {
    req.logOut();
    res.redirect('/');
});

// function ensureAuthenticated (req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     } else {
//         // logout
//     }
// }

module.exports = router;