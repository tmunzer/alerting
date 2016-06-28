var express = require('express');
var router = express.Router();
var Organization = require(appRoot + "/bin/models/organizations");
var api = require(appRoot + "/bin/aerohive/config");

router.get('/', function (req, res, next) {
    var filter = {};
    if (req.session.hasOwnProperty('passport')) {
        if (req.session.passport.user.fullAccess == false) filter = {id: req.session.passport.user.organization};
        Organization.find(filter, function (err, organizations) {
            if (err) {
                Error.render(err, "classroom", req, res);
            } else {
                res.render('web-app', {
                    title: 'Alerting',
                    organizations: organizations,
                    redirectUrl: api.redirectUrl,
                    clientId: api.clientId,
                    organization: req.session.passport.user.organization,
                    fullAccess: req.session.passport.user.fullAccess,
                    writeAccess: req.session.passport.user.writeAccess
                });
            }
        })
    } else res.redirect("/login/");
});
module.exports = router;