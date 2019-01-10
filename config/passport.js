const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    passport.use('user', new LocalStrategy({
        usernameField: 'loginEmail',
        passwordField: 'loginPassword'
    }, (loginEmail, loginPassword, done) => {
            User.findOne({ email: loginEmail })
                .then(user => {
                    if (!user) {
                        return done(null, false, { msg: 'User not registered' })
                    }
                    bcrypt.compare(loginPassword, user.password, (err, isMatch) => {
                        if (err) throw err;
                        
                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { msg: 'Incorrect Password' })
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    passport.use('admin', new LocalStrategy({ 
        usernameField: 'adminUsername',
        passwordField: 'adminPassword'
    }, (adminUsername, adminPassword, done) => {
            Admin.findOne({ username: adminUsername })
                .then(admin => {
                    if (!admin) {
                        return done(null, false, { message: 'Admin not registered' })
                    }
                    bcrypt.compare(adminPassword, admin.password, (err, isMatch) => {
                        if (err) throw err;
                        
                        if (isMatch) {
                            return done(null, admin)
                        } else {
                            return done(null, false, { message: 'Incorrect Password' })
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    function SessionConstructor(userId, userGroup, details) {
        this.userId = userId;
        this.userGroup = userGroup;
        this.details = details;
    }
    
    passport.serializeUser(function (userObject, done) {
        let userGroup = "user";
        let userPrototype =  Object.getPrototypeOf(userObject);
      
        if (userPrototype === User.prototype) {
            userGroup = "user";
        } else if (userPrototype === Admin.prototype) {
            userGroup = "admin";
        } 
    
        let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
        done(null,sessionConstructor);
    });
    
    passport.deserializeUser(function (sessionConstructor, done) {
        if (sessionConstructor.userGroup == 'user') {
            User.findOne({
                _id: sessionConstructor.userId
            }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
                done(err, user);
            });
        } else if (sessionConstructor.userGroup == 'admin') {
            Admin.findOne({
                _id: sessionConstructor.userId
            }, '-localStrategy.password', function (err, admin) { // When using string syntax, prefixing a path with - will flag that path as excluded.
                done(err, admin);
            });
        } 
    });
};