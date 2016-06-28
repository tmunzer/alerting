var express = require('express');
var router = express.Router();
var oauth = require(appRoot + '/bin/aerohive/api/oauth');
var Api = require(appRoot + '/bin/models/apis');

function renderError(error, currentPage, req, res) {
    console.log(error);
    res.render("error", {
        current_page: currentPage,
        error: error,
        user: req.session.passport.user,
        session: req.session
        //user_button: req.translationFile.user_button
    });
}
//===============================================================//
//============================ OAUTH ===========================//
//===============================================================//
router.get('/reg', function (req, res) {
    if (req.session.hasOwnProperty('passport')) {
        if (req.query.hasOwnProperty('error')) {
            Error.render(req.query.error, "conf", req, res);
        } else {
            var authCode = req.query.authCode;
            oauth.getPermanentToken(authCode, function (oauthData) {
                console.log(oauthData);
                if (oauthData) {
                    for (var owner in oauthData.data) {
                        if (req.session.passport.user.organization) oauthData.data[owner].organization = req.session.passport.user.organization;
                        Api(oauthData.data[owner]).save(function (err) {
                            if (err) {
                                renderError(err, "conf", req, res);
                            } else {
                                res.redirect('/settings');
                            }
                        });
                    }
                } else if (oauthData.hasOwnProperty('error')) renderError(oauthData.error, "conf", req);
            });
        }
    } else res.status(403).send('Unknown session');
});

module.exports = router;