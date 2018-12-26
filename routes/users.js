const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const passport = require('passport');

const User = require('../models/user');
const Service = require('../models/service');
const Product = require('../models/product');

const mongoURI ='mongodb://localhost:27017/zubismart';

const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true
});

let gfs;

conn.once('open', () => {
    console.log('Database File Upload Connection Established Successfully.');    
});

conn.on('error', (err) => {
    console.log('File Connection Error... ' + err);
});

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({
    storage
});;

const router = express.Router();

router.get('/image', (req, res) => {
    Product.findOne({}, (err, returnedImage) => {
        if (err) {
            return console.log(err);
        } else {
            console.log(base64ArrayBuffer(returnedImage.image.data.buffer));
            res.render('image', {
                // files: blobUtil.arrayBufferToBinaryString(returnedImage.image.data.buffer, 'image/jpeg')
                files: base64ArrayBuffer(returnedImage.image.data.buffer)
            });
        }
    });
});

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
        userName: req.body.userName,
        userEmail: req.body.userEmail,
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
            let product = new Product({
                name: req.body.itemName,
                category: req.body.itemCategory,
                userName: `${returnedUser.firstName} ${returnedUser.lastName}`,
                userEmail: returnedUser.email,
                phone: returnedUser.phone,
                description: req.body.itemDescription,
                price: req.body.itemPrice,
                originalname: file.originalname
            });
            product.image.data = fs.readFileSync(file.path);
            product.save((err, savedProduct) => {
                if (err) {
                    return console.log(err);
                } else {
                    fs.unlink(file.path, (err) => {
                        if (err) throw err;
                    });
                    req.flash('success', 'Item added sucessfully');
                    res.redirect(`/users/${req.params.id}/account`);
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
                        res.status(401).json({ message: 'Incorrect Password!'});
                    } else {
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
                                        gfs.files.deleteMany({metadata: {userEmail: returnedUser.email}}, (err, removedProductImages) => {
                                            if (err) {
                                                return console.log(err);
                                            } else {
                                                User.deleteOne({_id: req.params.id}, (err, removedUser) => {
                                                    if (err) {
                                                        return console.log(err);
                                                    } else {
                                                        res.status(200).json({ message: 'Account removed successfully' });
                                                    }
                                                });
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
//         req.flash('failure', 'Please login');
//         res.redirect('/');
//     }
// }

function base64ArrayBuffer(arrayBuffer) {
    var base64    = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  
    var bytes         = new Uint8Array(arrayBuffer)
    var byteLength    = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength    = byteLength - byteRemainder
  
    var a, b, c, d
    var chunk
  
    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
  
      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
      d = chunk & 63               // 63       = 2^6 - 1
  
      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }
  
    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength]
  
      a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
  
      // Set the 4 least significant bits to zero
      b = (chunk & 3)   << 4 // 3   = 2^2 - 1
  
      base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
  
      a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4
  
      // Set the 2 least significant bits to zero
      c = (chunk & 15)    <<  2 // 15    = 2^4 - 1
  
      base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }
    
    return base64
  }

module.exports = router;