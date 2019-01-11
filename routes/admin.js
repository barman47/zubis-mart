const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const passport = require('passport');

const router = express.Router();

const Admin = require('../models/admin');
const User = require('../models/user');
const ensureAdminAuthenticated = require('../utils/ensureAdminAuthenticated');

router.post('/register', (req, res) => {
    let admin = new Admin({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        transactionPassword: req.body.transactionPassword
    });
    Admin.findOne({ username: admin.username }, (err, returnedAdmin) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            if (returnedAdmin) {
                res.status(200).json({
                    msg: `${returnedAdmin.username} already exists!`,
                    returnedAdmin
                });
            } else {
                bcrypt.genSalt(10, admin.password, (err, salt) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    bcrypt.hash(admin.password, salt, (err, passwordHash) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        admin.password = passwordHash;
                        bcrypt.genSalt(10, admin.transactionPassword, (err, salt) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            bcrypt.hash(admin.transactionPassword, salt, (err, transactionPasswordHash) => {
                                if (err) {
                                    return res.status(500).send(err);
                                }
                                admin.transactionPassword = transactionPasswordHash;
                                admin.save((err, savedAdmin) => {
                                    if (err) {
                                        return res.status(500).send(err);
                                    }
                                    res.status(200).json({
                                        msg: 'Admin Added Successfully',
                                        savedAdmin
                                    }).end();
                                });
                            });
                        });
                    });
                });
            }
        }
    });
});

router.get('/login', (req, res) => {
    res.render('adminLogin', {
        title: 'Zubismart - Admin Login', 
        style: 'adminLogin.css',
        script: 'adminLogin.js'
    });
});

// router.post('/login', (req, res, next) => {
//     passport.authenticate('admin', {
//         successRedirect: `/admin/dashboard`,
//         failureRedirect: '/admin/login',
//         failureFlash: 'Incorrect Password'
//     })(req, res, next);
// });

router.post('/login', (req, res, next) => {
    passport.authenticate('admin', (err, admin, info) => {
        if (err) {
            return next(err);
        }
        if (!admin) {
            return res.render('adminLogin', {
                title: 'Zubismart - Admin Login', 
                style: 'adminLogin.css',
                script: 'adminLogin.js',
                adminPassword: req.body.adminPassword,
                adminUsername: req.body.adminUsername,
                wrongPassword: info.message
            });
        }
        req.logIn(admin, (err) => {
            if (err) {
                return console.log(err);
            } else {
                return res.redirect('/admin/dashboard');
            }
        });
    })(req, res, next);
});

router.get('/dashboard', ensureAdminAuthenticated, (req, res) => {
    User.find({})
        .then((users) => {
            res.render('adminDashboard', {
                title: 'Zubismart - Admin',
                style: 'adminDashboard.css',
                script: 'adminDashboard.js',
                users,
                numberOfUsers: users.length
            });
        })
        .catch((err) => {
            return console.log(err);
        });
});

router.delete('/removeUserAccount/:id', ensureAdminAuthenticated, (req, res) => {
    const transactionPasssword = req.body.password;
    User.findOne({_id: req.params.id}, (err, returnedUser) => {
        if (err) {
            return console.log(err);
        } else {
            Admin.findOne({ username: 'onwukazubis@gmail.com' }, (err, admin) => {
                if (err) {
                    return console.log(err);
                }
                bcrypt.compare(transactionPasssword, admin.transactionPassword, (err, isMatch) => {
                    if (err) {
                        return console.log(err);
                    }
                    if (!isMatch) {
                        return res.status(200).json({
                            message: 'Password Incorrect'
                        }).end()
                    }
                    Product.deleteMany({
                        userEmail: returnedUser.email}, (err, deletedProduct) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            Service.deleteMany({userEmail: returnedUser.email}, (err, removedService) => {
                                if (err) {
                                    return console.log(err);
                                } else {
                                    console.log('services removed successfully');
                                    if (err) {
                                        return console.log(err);
                                    } else {
                                        User.deleteOne({_id: req.params.id}, (err, removedUser) => {
                                            if (err) {
                                                return console.log(err);
                                            } else {
                                                res.status(200).json({ message: 'User removed successfully' });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
            });
        }
    });
});

router.put('/enableUser/:id', ensureAdminAuthenticated, (req, res) => {
    Admin.findOne({ username: 'onwukazubis@gmail.com' }, (err, returnedAdmin) => {
        if (err) {
            return console.log(err);
        } else {
            bcrypt.compare(req.body.transactionPassword, returnedAdmin.transactionPassword, (err, isMatch) => {
                if (err) {
                    return console.log(err);
                } else {
                    if (!isMatch) {
                        return res.status(200).json({
                            message: 'Password Incorrect'
                        }).end()
                    } else {
                        let paidAt = moment();
                        User.findOneAndUpdate({ _id: req.params.id }, { $set: {
                            hasPaid: true,
                            lastPaid: paidAt
                        }}, { new: true }, (err, updatedUser) => {
                            if (err) {
                                return console.log(err);
                            } else {
                                Product.updateMany({ userEmail: updatedUser.email }, { $set: {
                                    hasPaid: true
                                }}, { new: true }, (err, updatedProduct) => {
                                    if (err) {
                                        return console.log(err);
                                    } else {
                                        Service.updateMany({ userEmail: updatedUser.email }, { $set: {
                                            hasPaid: true
                                        }}, { new: true }, (err, updatedService) => {
                                            if (err) {
                                                return console.log(err);
                                            } else {
                                                res.status(200).json({ 
                                                    message: 'User Enabled Successfully',
                                                    updatedUser,
                                                    paidAt: paidAt.fromNow()
                                                }).end();
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

router.put('/disableUser/:id', ensureAdminAuthenticated, (req, res) => {
    Admin.findOne({ username: 'onwukazubis@gmail.com' }, (err, returnedAdmin) => {
        if (err) {
            return console.log(err);
        } else {
            bcrypt.compare(req.body.transactionPassword, returnedAdmin.transactionPassword, (err, isMatch) => {
                if (err) {
                    return console.log(err);
                } else {
                    if (!isMatch) {
                        return res.status(200).json({
                            message: 'Password Incorrect'
                        }).end()
                    } else {
                        User.findOneAndUpdate({ _id: req.params.id }, { $set: {
                            hasPaid: false
                        }}, { new: true }, (err, updatedUser) => {
                            if (err) {
                                return console.log(err);
                            } else {
                                Product.updateMany({ userEmail: updatedUser.email }, {$set: {
                                    hasPaid: false
                                }}, { new: true }, (err, updatedProduct) => {
                                    if (err) {
                                        return console.log(err);
                                    } else {
                                        Service.updateMany({ userEmail: updatedUser.email }, {$set: {
                                            hasPaid: false
                                        }}, { new: true }, (err, updatedService) => {
                                            if (err) {
                                                return console.log(err);
                                            } else {
                                                res.status(200).json({ 
                                                    message: 'User Disabled Successfully',
                                                    updatedUser 
                                                }).end();
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

module.exports = router;