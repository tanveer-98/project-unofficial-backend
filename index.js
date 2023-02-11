const _ = require('lodash');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const chalk = require('chalk');
const hagen = require("hagen").default;
const downtimeTest = require('./routes/downtimeTest');
const feeds = require('./routes/feed')
const cloudinary = require('./routes/cloudinary')
const members = require('./routes/members');
const gallery = require('./routes/gallery');
const posts = require('./routes/posts');
const contact = require('./routes/contact')
const users = require('./routes/users');
const auth = require('./routes/auth');
const aboutUs = require('./routes/aboutUs');
const membershipForm = require('./routes/membershipForm');

require('./db/db')

app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:8888', 'http://localhost:5173'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        // res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/downtime-test', downtimeTest);
app.use('/feeds', feeds)
app.use('/cloudinary', cloudinary)
app.use('/members', members);
app.use('/gallery', gallery);
app.use('/posts', posts);
app.use('/contact', contact);
app.use('/users', users);
app.use('/login', auth);
app.use('/aboutUs', aboutUs);
app.use('/membershipForm', membershipForm);

if (!config.get('jwtPrivateKey')) {
    hagen.error('JWTError', 'FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}
let port;
try {
    port = config.get("PORT");
}
catch (ex) {
    port = 3000
}
app.listen(port, () => hagen.success('PORT', chalk.green.bgWhite.bold(`Listening on port ${port}...`)));