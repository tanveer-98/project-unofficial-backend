const cloudinary = require('cloudinary').v2;
require('../config/cloudinary_config');
const express = require('express');
const cors = require('cors')

const router = express();

var corsOptions = {
    origin: '*',
};

const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

router.get('/gallery', [cors(corsOptions)], (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    signature = cloudinary.utils.api_sign_request({
        ...req.query,
        source: 'uw',
        tags: ['gallery'],
        upload_preset: 'gallery',
        timestamp: timestamp
    },
        cloudinary.config().api_secret
    );
    res.send({signature, timestamp});
});

router.get('/aboutUs', [cors(corsOptions)], (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    signature = cloudinary.utils.api_sign_request({
        ...req.query,
        source: 'uw',
        tags: ['aboutUs'],
        upload_preset: 'aboutUs',
        timestamp: timestamp
    },
        cloudinary.config().api_secret
    );
    res.send({signature, timestamp});
});

router.get('/posts', [cors(corsOptions)], (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    signature = cloudinary.utils.api_sign_request({
        ...req.query,
        source: 'uw',
        tags: ['posts'],
        upload_preset: 'posts',
        timestamp: timestamp
    },
        cloudinary.config().api_secret
    );
    res.send({signature, timestamp});
});

router.get('/members', async (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    signature = cloudinary.utils.api_sign_request({
        ...req.query,
        source: 'uw',
        tags: ['membersUpload'],
        upload_preset: 'members',
        timestamp: timestamp
    },
        cloudinary.config().api_secret
    );
    res.status(200).send({signature, timestamp});
});

router.get('/memberForm', async (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    signature = cloudinary.utils.api_sign_request({
        ...req.query,
        source: 'uw',
        tags: ['memberForm'],
        upload_preset: 'memberForm',
        timestamp: timestamp
    },
        cloudinary.config().api_secret
    );
    res.status(200).send({signature, timestamp});
});

router.get('/feed', async (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    signature = cloudinary.utils.api_sign_request({
        ...req.query,
        source: 'uw', 
        tags: ['feedsUpload'],
        upload_preset: 'feed',
        timestamp: timestamp
    },
        cloudinary.config().api_secret
    );
    res.status(200).send({signature, timestamp});
});


module.exports = router;