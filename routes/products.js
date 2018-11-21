const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');

const router = express.Router();

const User = require('../models/user');
const Service = require('../models/service');
const Product = require('../models/product');

const mongoURI = require('../config/database').database;

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


module.exports = router