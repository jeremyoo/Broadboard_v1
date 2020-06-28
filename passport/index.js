const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
// create passport LocalStrategy instance through pre-made P-L-M function
passport.use(new LocalStrategy(User.authenticate()));
// (X) passport.use(User.createStrategy());

// send only user.id through cookie to client 
passport.serializeUser(User.serializeUser());

// on request, check user.id of cookie from client
passport.deserializeUser(User.deserializeUser());
// *every request passport.session() calls deserialize
};