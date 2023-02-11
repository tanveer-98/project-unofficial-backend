const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

router.get('/me', [auth, admin], async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.send(user);
});

router.post('/sign-up', async (req, res) => {
    // console.log(req.body) 
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email}).select("_id").lean();
    if(user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.isAdmin = false;

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

});

router.post('/sign-up-admin', async (req, res) => {
    // console.log(req.body) 
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email}).select("_id").lean();
    if(user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.isAdmin = true;

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

});


module.exports = router;