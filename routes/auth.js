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
        if (!username) {
            req.flash('error', 'You need to insert username');
            return res.redirect('/join');
        }
        else if (!nickname) {
            req.flash('error', 'You need to insert nickname');
            return res.redirect('/join');
        }
        else if (!password) {
            req.flash('error', 'You need to insert password');
            return res.redirect('/join');
        }
        await User.register(user, password, (err, users) => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/join');    
            }
            passport.authenticate('local', {
                successRedirect: '/',
                successFlash: 'You account has been successfully created',
                failureRedirect: '/join',
            })(req, res, next);
        });
});

router.post('/login', isNotLoggedIn, async (req, res, next) => {
    const { username, password } = req.body;
    if (!username) {
        req.flash('error', 'You need to insert username');
        return res.redirect('/login');
    }
    else if (!password) {
        req.flash('error', 'You need to insert password');
        return res.redirect('/login');
    }
    await passport.authenticate('local', {
        successReturnToOrRedirect: '/',
        successFlash: 'You have successfully logged in',
        failureRedirect: '/login',
        failureFlash: 'Please check your username and password',
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout();
    req.flash('success', 'Your have successfully logged out')
    res.redirect('/');
});

module.exports = router;