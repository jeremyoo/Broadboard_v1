const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const { isLoggedIn, isNotLoggedIn } = require('../middleware');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { username, nickname, password } = req.body;
    const user = new User({
        username: username,
        nickname: nickname,
    });
    try {
        await User.register(user, password);
        await passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: 'failed to login',
        })(req, res, next);
        req.flash('success', 'Your account has successfully created')
    } catch (error) {
        req.flash('error', 'Unexpected error has occured with service')
        console.error(error);
        next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/login',
    })(req, res, next);
    req.flash('success', 'Your have successfully logged in')
});

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout();
    req.flash('success', 'Your have successfully logged out')
    res.redirect('/');
});

module.exports = router;