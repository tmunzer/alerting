var express = require('express');
var router = express.Router();
var logger = require(appRoot + "/app").logger;

var Alarms = require(appRoot + "/bin/models/alarms");



//========================== GET ORGANIZATIONS ===========================//
router.get("/", function (req, res, next) {
    if (req.session.hasOwnProperty('passport')) {
        var filterString = {};
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.fullAccess == false) filterString = {organization: req.session.passport.user.organization};
        // else if request is filtered on an organization
        else if (req.query.hasOwnProperty('organizationId') && req.query.organizationId.length > 1) filterString = {organization: req.query.organizationId};
        Alarms.find(filterString, function (err, alarms) {
            if (err) res.json({error: err});
            else res.json({alarms: alarms});
        });
    } else res.status(403).send('Unknown session');
});
//========================== CREATE/UPDATE ORGANIZATION ===========================//
router.post("/", function (req, res, next) {
    var organization;
    if (req.session.hasOwnProperty('passport')) {
        if (req.body.hasOwnProperty('organizationId') && req.body.organizationId.length > 1 && req.body.hasOwnProperty("organization")) {
            organization = req.body.organization;
            //if user is not an admin (only admin can edit all schools)
            if (req.session.passport.user.fullAccess == false) var organizationId = req.session.passport.user.organization;
            else var organizationId = req.body.organizationId;
            // update the user
            Organization.findOneAndUpdate({id: organizationId}, organization, function (err) {
                if (err) res.json({error: err});
                else res.json({});
            });
        } else if (req.body.hasOwnProperty("organization")) {
            organization = req.body.organization;
            //if user is not an admin (only admin can edit all schools)
            if (req.session.passport.user.fullAccess == false) var organizationId = req.session.passport.user.organization;
            // update the school
            Organization(organization).save(function (err) {
                if (err) res.json({error: err});
                else res.json({});
            });
        }
    } else res.status(403).send('Unknown session');
});
//========================== DELETE ORGANIZATION ===========================//
router.delete('/', function (req, res) {
    if (req.session.hasOwnProperty('passport')) {
        if (req.query.hasOwnProperty("id")) {
            Organization.findOneAndRemove({id: req.query.id}, function (err) {
                if (err) res.json({error: err});
                else res.json({});
            })
        }
    } else res.status(403).send('Unknown session');
});

module.exports = router;