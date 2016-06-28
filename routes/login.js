var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/login/', function (req, res, next) {
    if (req.session.hasOwnProperty("passport")) res.redirect('/web-app/');
    else res.render('login', {title: 'Admin Login'});

});
/* Handle Login POST */
router.post('/login', passport.authenticate('login', {
        successRedirect: '/web-app/',
        failureRedirect: '/login/',
        failureFlash: true
    })
);

/* Handle Logout */
router.get('/logout/', function (req, res) {
    if (req.session.hasOwnProperty('passport')) console.log("User " + req.session.passport.user.email+ " is now logged out.");
    req.logout();
    req.session.destroy();
    res.redirect('/login/');
});
module.exports = router;