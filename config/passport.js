const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    passport.use('user', new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      }, function verifyCallback(req, email, password, done) {
            User.findOne({ email: email }, function(err, user) {
            if (err) return done(err);
            if (!user) {
                return done(null, false, {msg: 'No user found'});
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return done(err);
                if (!isMatch) {
                    return done(null, false, {msg: 'Incorrect Password'});
                } else {
                    return done(null, user);
                }
            });
        });
    }));

    passport.use('admin', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function verifyCallback (req, username, password, done) {
        Teacher.findOne({username}, function (err, admin) {
            if (err) {
                return done (err);
            }

            if (!admin) {
                return done(null, false, {msg: 'No admin found'});
            }
            bcrypt.compare(password, admin.password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done (null, false, {msg: 'Incorrect Password'});
                } else {
                    return done(null, admin);
                }
            });
        });
    }));

    let sessionConstructor = function (userId, userGroup, details) {
        this.userId = userId;
        this.userGroup = userGroup;
        this.details = details;
    }

    passport.serializeUser((userObject, done) => {
        let userGroup = User;
        let userPrototype = Object.getPrototypeOf(userObject);

        if (userPrototype === User.prototype) {
            userGroup = User;
        } else if (userPrototype === Admin.prototype) {
            userGroup = Admin;
        }

        sessionConstructor = new SessionConstructor(userObject.id, userGroup);
        done (null, sessionConstructor);
    });

    passport.deserializeUser((sessionConstructor, done) => {
        if (sessionConstructor.userGroup === User) {
            User.findOne({
                _id: sessionConstructor.userId,
            }, '-localStrategy.password', (err, user) => {
                done (err, user)
            });
        } else if (sessionConstructor.userGroup === Admin) {
            Admin.findOne({
                _id: sessionConstructor.userId
            }, '-localStrategy.password', (err, admin) => {
                done (err, admin);
            });
        }
    });
};