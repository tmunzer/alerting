var express = require('express');
var filters = require(appRoot + "/routes/api_filters");
var router = express.Router();


var Organization = require(appRoot + "/bin/models/organizations");


//========================== GET ORGANIZATIONS ===========================//
router.get("/", function (req, res, next) {
    if (req.session.hasOwnProperty('passport')) {
        var filterString = {};
        //if user is not an admin (only admin can view all schools)
        if (req.session.passport.user.fullAccess == false) filterString = {_id: req.session.passport.user.organization};
        // else if request is filtered on an organization
        else if (req.query.hasOwnProperty('organizationId') && req.query.organizationId.length > 1) filterString = {_id: req.query.organizationId};
        Organization.find(filterString, function (err, organizations) {
            if (err) res.json({error: err});
            else res.json({organizations: organizations});
        });
    } else res.status(403).send('Unknown session');
});
//========================== CREATE/UPDATE ORGANIZATION ===========================//
router.post("/", function (req, res, next) {
    var organization;
    if (req.session.hasOwnProperty('passport')) {
        //if user is not an admin (only admin can edit all organizations)
        if (req.session.passport.user.fullAccess == true) {
            if (req.body.hasOwnProperty('organizationId') && req.body.hasOwnProperty("organization")) {
                organization = req.body.organization;

                // update the organization
                Organization.findOneAndUpdate({_id: req.body.organizationId}, organization, function (err) {
                    if (err) res.json({error: err});
                    else res.json({});
                });

            } else if (req.body.hasOwnProperty("organization")) {
                organization = req.body.organization;
                // create the organization
                Organization(organization).save(function (err) {
                    if (err) res.json({error: err});
                    else res.json({});
                });
            }
        } else res.status(401).send("Not enough permissions to create an organization");
    } else res.status(403).send('Unknown session');
});
//========================== DELETE ORGANIZATION ===========================//
router.delete('/', function (req, res) {
    if (req.session.hasOwnProperty('passport')) {
        if (req.query.hasOwnProperty("id")) {
            var organizationId = filters.getOrganizationId(req);
            var filterString = {_id: req.query.id};
            if (organizationId != 0) filterString = {organization: organizationId, _id: req.query.id};
            Organization.findOneAndRemove(filterString, function (err) {
                if (err) res.json({error: err});
                else res.json({});
            })
        }
    } else res.status(403).send('Unknown session');
});

module.exports = router;