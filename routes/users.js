const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const passport = require('passport');

const User = require('../models/user');
const Service = require('../models/service');
const Product = require('../models/product');

const mongoURI = require('../config/database').database;

const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true
});

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('images');
    console.log('Database File Upload Connection Established Successfully.');
});

conn.on('error', (err) => {
    console.log('File Connection Error... ' + err);
});

const storage = new GridFsStorage({
  url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'images'
                };
                resolve(fileInfo);
            });
        });
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

router.get('/image', (req, res) => {
    const query = {
        metada: {itemaName: 'New Product'}
    };
    gfs.files.find().toArray((err, returnedFiles) => {
        if (err) {
            return console.log(err);
        } else {
            console.log(returnedFiles);
            res.render('image', {
                files: returnedFiles
            });
        }
    });
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
            Product.find({userEmail: user.email}, (err, products) => {
                if (err) {
                    return console.log(err);
                } else {
                    Service.find({userName: `${user.firstName} ${user.lastName}`}, (err, services) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            res.render('dashboard', {
                                title: `Zubis Mart - ${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`,
                                style: 'dashboard.css',
                                script: 'dashboard.js',
                                firstName: user.firstName.toLowerCase(),
                                lastName: user.lastName.toLowerCase(),
                                products,
                                services,
                                user
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post('/addService', (req, res) => {
    const service = new Service({
        category: req.body.category,
        userName: req.body.user,
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
    const file = req.file;
    User.findOne({_id: req.params.id}, (err, returnedUser) => {
        if (err) {
            return console.log(err);
        } else {
            gfs.files.updateOne({filename: file.filename}, {$set: {metadata: {
                itemName:req.body.itemName,
                category: req.body.itemCategory,
                userName: `${returnedUser.firstName} ${returnedUser.lastName}`,
                userEmail: returnedUser.email,
                description: req.body.itemDescription,
                price: req.body.itemPrice
            }}}, (err, updatedFile) => {
                if (err) {
                    return console.log(err);
                } else {
                    let product = new Product({
                        name: req.body.itemName,
                        category: req.body.itemCategory,
                        userName: `${returnedUser.firstName} ${returnedUser.lastName}`,
                        userEmail: returnedUser.email,
                        description: req.body.itemDescription,
                        price: req.body.itemPrice
                    });
                    product.save((err, savedProduct) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            req.flash('success', 'Product added sucessfully');
                            res.redirect(`/users/${req.params.id}/account`);
                        }
                    });
                }
            });
        }
    });
});

router.delete('/removeUser/:id', (req, res) => {
    const password = req.body.removeAccountPassword;
    User.findOne({_id: req.params.id}, (err, returnedUser) => {
        if (err) {
            return console.log(err);
        } else {
            bcrypt.compare(password, returnedUser.password, (err, isMatch) => {
                if (err) {
                    return console.log(err);
                } else {
                    if (!isMatch) {
                        console.log('incorrect password');
                        res.status(401).json({ message: 'Incorrect Password!'});
                    } else {
                        Product.deleteMany({
                            user: `${returnedUser.firstName} ${returnedUser.lastName}`, 
                            userEmail: returnedUser.email}, (err, deletedProduct) => {
                            if (err) {
                                return console.log(err);
                            } else {
                                console.log('Products removed sucessfully');
                                Service.deleteMany({
                                    user: `${returnedUser.firstName} ${returnedUser.lastName}`}, (err, removedService) => {
                                    if (err) {
                                        return console.log(err);
                                    } else {
                                        console.log('services removed successfully');
                                        // gfs.files.remove({metadata.user: returnedUser});
                                        User.deleteOne({_id: req.params.id}, (err, removedUser) => {
                                            if (err) {
                                                return console.log(err);
                                            } else {
                                                res.status(200).json({ message: 'Account removed successfully' })
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});

router.put('/editUser/:id', (req, res) => {
    User.findOne({_id: req.params.id}, (err, returnedUser) => {
        if (err) {
            return console.log(err);
        } else {
            bcrypt.compare(req.body.password, returnedUser.password, (err, isMatch) => {
                if (isMatch) {
                    console.log('Correct Password');
                    User.findOneAndUpdate({_id: req.params.id}, {$set: {
                        firstName: req.body.firstName.toUpperCase(),
                        lastName: req.body.lastName.toUpperCase(),
                        phone: req.body.phone,
                        email: req.body.email
                    }}, {new: true}, (err, updatedData) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            console.log('data updated successfully');
                            res.status(200).json(updatedData);
                        }
                    });
                } else {
                    console.log('Incorrect Password');
                    res.status(401).json({ message: 'Incorrect Password!' });
                }
            });
        }
    });
});

router.put('/:id/changePassword', (req, res) => {
    User.findOne({_id: req.params.id}, (err, returnedUser) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Something Went wrong. Try again' });
        } else {
            bcrypt.compare(req.body.oldPassword, returnedUser.password, (err, isMatch) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: 'Something Went wrong. Try again' });
                } else {
                    if (!isMatch) {
                        console.log('No match');
                        res.status(401).json({ message: 'Incorrect Password' });
                    } else {
                        console.log('There is a Match');
                        bcrypt.genSalt(10, (err, salt) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ error: 'Something Went wrong. Try again' });
                            } else {
                                bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).json({ error: 'Something Went wrong. Try again' });
                                    } else {
                                        const newPassword = hash;
                                        User.findOneAndUpdate({_id: req.params.id}, {$set: {password: newPassword}}, (err) => {
                                            if (err) {
                                                console.log(err);
                                                res.status(500).json({ error: 'Something Went wrong. Try again' });
                                            } else {
                                                console.log('Password Changed Successfully');
                                                res.status(200).json({ message: 'Password Changed Successfully' });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});

router.delete('/removeProduct', (req, res) => {
    console.log(req.body);
    Product.findOneAndRemove({_id: req.body.id}, (err, removedProduct) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Product not removed' });
        } else {
            console.log('Product removed successfully');
            res.status(200).json({ message: 'Product removed successfully' });
        }
    });
});

router.delete('/removeService', (req, res) => {
    console.log(req.body);
    Service.findOneAndRemove({_id: req.body.id}, (err, removedService) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Service not removed' });
        } else {
            console.log('Service removed successfully');
            res.status(200).json({ message: 'Service removed successfully' });
        }
    });
});

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