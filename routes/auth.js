const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const config = require('config');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send({token: "", user: {}, response: false, message: "Invalid email or password."});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({token: "", user: {}, response: false, message: "Invalid email or password."});

    const token = user.generateAuthToken();
    res.send({token: token, user: {name: user.name, email: user.email}, response: true});

});

router.get('/verify', async (req, res) => {
    const token = req.header('x-auth-token');
    // console.log(token)
    if(!token) return res.status(400).send({message: 'no x-auth-token in header', response: false});

    try{
        jwt.verify(token, config.get('jwtPrivateKey'));
        res.send({message: 'x-auth-token verified', response: true});
    }
    catch(ex){
        res.status(400).send({message: 'x-auth-token unverified', response: false});
    }

});
module.exports = router;