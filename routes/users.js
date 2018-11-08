const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user');
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