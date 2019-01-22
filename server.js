const express = require('express');
const exphbs = require('express-handlebars');
// const favicon = require('express-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const moment = require('moment');

const index = require('./routes/index');
const admin = require('./routes/admin');
const products = require('./routes/products');
const services = require('./routes/services');
const users = require('./routes/users');

const path = require('path');
const publicPath = path.join(__dirname, 'public');
const config = require('./config/database');
const app = express();

const PORT = process.env.PORT || 6400;

mongoose.connect(config.database, {
    useNewUrlParser: true,
    useCreateIndex: true
});

const conn = mongoose.connection;

conn.once('open', () => {
    console.log('Database Connection Established Successfully.');
    // Checking user subscription
    User.find({})
        .then((users) => {
            const today = new moment();
            let dateCreated;
            let expiryDate;
            users.forEach((user) => {
                dateCreated = new moment(user.createdAt);
                expiryDate = dateCreated.add(1, 'month');
                if (today >= expiryDate) {
                    User.findOneAndUpdate({ _id: user.id}, { $set: {
                        hasPaid: false
                    } }, { new: true })
                        .then((updatedUser) => {
                            Product.updateMany({ userEmail: user.email }, { $set: {
                                hasPaid: false
                            } }, { new: true }, (err, updatedProducts) => {
                                if (err) {
                                    console.log(err);
                                }
                                Service.updateMany({ userEmail: user.email }, { $set: {
                                    hasPaid: false
                                } }, { new: true }, (err, updatedServices) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log('user subscription expired ', updatedUser);
                                });
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            });
            console.log('Done Checking user subscription.');
        })
        .catch((err) => {
            console.log(err);
        });
});

conn.on('error', (err) => {
    console.log('Unable to Connect to Database. ' + err);
});

// app.use(favicon(publicPath + '/img/favicon.png'));
app.use(express.static(publicPath));
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    partialsDir: 'views/partials',
    helpers: {
        base64ArrayBuffer: require('./utils/base64ArrayBuffer'),
        hasPaid: require('./utils/hasUserPaid'),
        lastPaid: require('./utils/lastPaid'),
        lastLogin: require('./utils/lastLogin'),
        searchResults: require('./utils/searchResults'),
        formatJoinedDate: require('./utils/formatJoinedDate'),
        formatPrice: require('./utils/formatPrice'),
        paymentRequest: require('./utils/paymentRequest')
    }
}));
app.set('view engine', '.hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('keyboard cat'));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 300000
    }
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success');
    res.locals.failure_message = req.flash('failure');
    next();
});

app.use('/', index);
app.use('/admin', admin);
app.use('/products', products);
app.use('/services', services);
app.use('/users', users);

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}...`);   
});