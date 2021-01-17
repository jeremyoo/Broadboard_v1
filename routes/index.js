const express = require('express');
const moment = require('moment');
const User = require('../models/user');
const Board = require('../models/board');
const Comment = require('../models/comment');
const { isLoggedIn, isNotLoggedIn } = require('../middleware');

const router = express.Router();

// show profile page
router.get('/', (req, res, next) => {
    res.render('main', {
        user: req.user,
    });
});

// show sing up page
router.get('/join', isNotLoggedIn, (req, res, next) => {
    res.render('join', {
        user: req.user,
    });
});

// show log in page
router.get('/login', isNotLoggedIn, (req, res, next) => {
    res.render('login', {
        user: req.user,
    });
});

// show about page
router.get('/about', (req, res, next) => {
    res.render('about', {
        user: req.user,
    });
});

module.exports = router;
